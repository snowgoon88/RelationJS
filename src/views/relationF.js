import { fabric } from 'fabric';
import { getPosF} from './utils';
import { Vec,
         intersectRectVec,
         computeBezierPointVec } from '../utils/vec';
import { addToAllSelectable, removeFromAllSelectable } from '../utils/select_pop';

/*
import {RelationF} from 'path/relationF';
*/

// *****************************************************************************
// ******************************************************************* RelationF
// require: fabric.js, canvas, Vector
// A RelationF is made of:
// - pathF [fabric.Path] : the bezier path
// - headF [fabric.Triangle] : arrow head
// - ctrlF [fabric.Circle] : ctrl Point for the path
// - midF [???] : point a the middle abscisse of the path
// - labelF [fabric.] : the text, near the mid point
export class RelationF {
  constructor( canvas, relationM, colRGB ) {
    this.canvas = canvas;
    this.id = relationM.id;
    this.model = relationM;
    this.elemType = "Relation";
    // default path is 100,100 --<150,90>--> 200,100
    this.srcPt =  new Vec( 100, 100 );
    this.ctrlPt = new Vec( 150,  80 );
    this.destPt = new Vec( 200, 100 );
    this.midPt = computeBezierPointVec( this.srcPt, this.destPt,
                                        this.ctrlPt, 0.5 );

    // FabricJS elements
    this.pathF = new fabric.Path( 'M100,100 Q150,80 200,100', {
      id: relationM.id,
      model: relationM,
      elemType: "Relation",
      
      stroke: colRGB,
      fill: false,
      selectable: true,
      perPixelTargetFind: true,
      hasControls: false,
      hasRotatingPoint: false,
      lockRotation: true,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockSkewingX: true,
      lockSkewingY: true,
    });
    this.ctrlF = new fabric.Circle({
      id: relationM.id,
      model: relationM,
      elemType: "Relation",

      originX: 'center',
      originY: 'center',
      left: 150,
      top: 80,
      radius: 10,
      stroke: colRGB,
      fill: colRGB,
      selectable: true,
      hasControls: false,
      hasRotatingPoint: false,
      lockRotation: true,
      lockMovementX: false,
      lockMovementY: false,
      lockScalingX: true,
      lockScalingY: true,
      lockSkewingX: true,
      lockSkewingY: true,
    });
    
    this.headF = new fabric.Triangle({
      id: relationM.id,
      model: relationM,
      elemType: "Relation",

      originX: 'center',
      left: 10,
      //originY: 'center',
      top: 10,
      width: 12,
      height: 20,
      stroke: colRGB,
      fill: colRGB,
      selectable: false,
      hasControls: false,
      hasRotatingPoint: false,
      lockRotation: true,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockSkewingX: true,
      lockSkewingY: true,
    });
    this.labelF = new fabric.IText( relationM.id+': '+relationM.name, {
      id: relationM.id,
      model: relationM,
      elemType: "Relation",

      originX: 'center',
      originY: 'center',
      left: this.midPt.x,
      top: this.midPt.y,
      fontSize: 16,
      fill: colRGB,
      selectable: false,
      hasRotatingPoint: false,
      lockRotation: true,
      lockScalingX: true,
      lockSclaingY: true,
      lockSkewingX: true,
      lockSkewingY: true,
      //padding: 10,
      // IText
      editable: false,
    });
    
    
    let srcF = relationM.srcM.viewF;
    let destF = relationM.destM.viewF;
    this._updateWithNewEnds( srcF, destF );

    this.ctrlF.on( 'modified', (opt) => {
      console.log( 'modCtrl', opt );
      this.updateCtrl();
    });
    this.ctrlF.on( 'deselected', (opt) => {
      console.log( 'des opt=', opt );
      this.setInactive();
    });
    this.pathF.on( 'selected', (opt) => {      
      console.log( 'selPath opt=',opt );
      this.setActive();
    });

    addToAllSelectable( this.pathF );
    addToAllSelectable( this.ctrlF );
    
    this.canvas.add( this.pathF );
    this.canvas.add( this.headF );
    this.canvas.add( this.ctrlF );
    this.canvas.add( this.labelF );
  }
  edit( relationM ) {
    this.labelF.set( {'text' : relationM.id+': '+relationM.name } );
  }
  remove() {
    removeFromAllSelectable( this.pathF );
    removeFromAllSelectable( this.ctrlF );
    
    this.canvas.remove( this.pathF );
    this.canvas.remove( this.headF );
    this.canvas.remove( this.ctrlF );
    this.canvas.remove( this.labelF );
  }
  toArchive() {
    var archive = {
      posCtrl: this.ctrlPt,
    };
    return archive;
  }
  setCtrlPt( ctrlPt ) {
    this.ctrlPt = new Vec( ctrlPt.x, ctrlPt.y );
    this._updateWithNewEnds( this.model.srcM.viewF, this.model.destM.viewF );
  }
  // call when src or/and dest have moved
  updateEnds() {
    this._updateWithNewEnds( this.model.srcM.viewF, this.model.destM.viewF );
  }
  updateCtrl() {
    this.ctrlPt = new Vec( this.ctrlF.left, this.ctrlF.top );
    this.midPt = computeBezierPointVec( this.srcPt, this.destPt,
                                        this.ctrlPt, 0.5 );
    this.updatePath();
  }
  // set as the active Object
  setActive() {
    this.ctrlF.set( 'selectable', true );
    this.ctrlF.set( 'visible', true );
    this.canvas.setActiveObject( this.ctrlF );
  }
  setInactive() {
    console.log( 'Inactive' );
    this.ctrlF.set( 'selectable', false );
    this.ctrlF.set( 'visible', false );
  }
  
  // when src and/or dest have moved
  _updateWithNewEnds( srcF, destF ) {
    console.log( '  update', this.model.name );
    console.log( '  srcF', srcF );
    console.log( '    co', srcF.calcCoords() );
    console.log( '  destF', destF );
    console.log( '    co', destF.calcCoords() );
    destF.setCoords();
    console.log( '  destF', destF );
    let posSrcF = getPosF( srcF );
    let posDestF = getPosF( destF );
    let srcNew =  new Vec( posSrcF.left,  posSrcF.top );
    let destNew = new Vec( posDestF.left, posDestF.top);
    
    let srcCtrlOld = this.ctrlPt.minus( this.srcPt );
    let srcDestOld = this.destPt.minus( this.srcPt );
    let normOld = srcDestOld.norm();

    // Old projection of ctrlPt on local frame (src->dest)
    let ctrlXRatio = srcCtrlOld.dot( srcDestOld ) / (normOld * normOld);
    let ctrlYRatio = srcCtrlOld.dot( srcDestOld.perp()) / (normOld * normOld);

    // Actual projection
    let srcDest = destNew.minus( srcNew ); 
    let updCtrlX = srcDest.scalar( ctrlXRatio );
    let updCtrlY = srcDest.perp().scalar( ctrlYRatio );
    this.ctrlPt = new Vec( srcNew.x + updCtrlX.x + updCtrlY.x,
                           srcNew.y + updCtrlX.y + updCtrlY.y );

    // update ControlPointF
    this.ctrlF.set( {'left': this.ctrlPt.x, 'top': this.ctrlPt.y} );
    this.ctrlF.setCoords();

    // update EndPoints
    this.srcPt = srcNew;
    this.destPt = destNew;
    this.midPt = computeBezierPointVec( this.srcPt, this.destPt,
                                        this.ctrlPt, 0.5 );
    this.updatePath();
  }
  // call to recompute path
  updatePath() {
    // update PathF and arrowHead
    // taking into account the BBOX
    let srcF = this.model.srcM.viewF;
    let destF = this.model.destM.viewF;
    let posSrcF = getPosF( srcF );
    let posDestF = getPosF( destF );
    
    // update arrowHead
    let vecSC = this.ctrlPt.minus( this.srcPt );
    let srcCoord = intersectRectVec( posSrcF, vecSC );
    let vecDC = this.ctrlPt.minus( this.destPt );
    let destCoord= intersectRectVec( posDestF, vecDC );
    let arrowAngle =  Math.atan2( -vecDC.y, -vecDC.x );
    arrowAngle += Math.PI / 2.0;
    arrowAngle *= 180.0 / Math.PI;
    this.headF.set( {'left': destCoord.x, 'top': destCoord.y,
                     'angle': arrowAngle} );
    this.headF.setCoords();

    this.labelF.set( {'left': this.midPt.x, 'top': this.midPt.y } );
    this.labelF.setCoords();
    
    this.pathF.set( 'path', this._toPathArray( srcCoord, destCoord ) );
    let dims = this.pathF._calcDimensions();
    this.pathF.set( {
      width: dims.width,
      height: dims.height,
      left: dims.left,
      top: dims.top,
      pathOffset: {
        x: dims.width / 2 + dims.left,
        y: dims.height / 2 + dims.top
      },
      dirty: true
    });
    this.pathF.setCoords();
  }
  // build a proper SVG Array for path
  _toPathArray( srcV, destV) {
    let path = [];
    path.push( ["M", srcV.x, srcV.y] );
    path.push( ["Q", this.ctrlPt.x, this.ctrlPt.y, destV.x, destV.y] );
    return path;
  }
}
// ************************************************************* END - RelationF
