// *****************************************************************************
// ************************************************************************ Event
// debug Event at body level -> look at target
var bodyElement = document.getElementsByTagName("BODY")[0];
/* bodyElement.addEventListener( 'contextmenu', function (event) {
 *   console.log( "BODY context", event );
 * }); */
// ESC : keydown (repeated) keyup
/* bodyElement.addEventListener( 'keydown', function (event) {
 *   console.log( "BODY keydown", event );
 * });
 * bodyElement.addEventListener( 'keypress', function (event) {
 *   console.log( "BODY keypress", event );
 * }); */
bodyElement.addEventListener( 'keyup', function (event) {
  //console.log( "BODY keyup", event );
  if (event.key === "Escape" ) {
    //console.log( "  ESC" );
    removeContextElementC();
    abortDrawArrow();
  }
});


// Fabric in canvas Element 'fabric_canvas'
var canvas = new fabric.Canvas( 'fabric_canvas', {
  width: 600,
  height: 600,
  fireRightClick: true,
  fireMiddleClick: true,
  stopContextMenu: true,
});

// *****************************************************************************
// **************************************************** Selectability/Popability
// to switch selected FabricObject between selectable/non-selectable
// TODO: need to be remove from the list
var _allSelectableF = [];
function allSetSelectable( flag ) {
  _allSelectableF.map( (item,index) => {
    item.selectable = flag;
  });
  canvas.requestRenderAll();
}
function removeFromAllSelectable( itemF ) {
  _allSelectableF = _allSelectableF.filter( (ele) => {
    ele != itemF;
  });
}
var _allowPopup = true;
function setPopable( flag ) {
  console.log( "setPopable", flag );
  _allowPopup = flag;
}
// *****************************************************************************
// ********************************************************************* Faction
// *****************************************************************************
class FactionM {
  constructor( id, name ) {
    this.id = id;
    this.name = name;
    this.type = 'FactionM';
    this.viewF = null;      // FabricJS view
  }
  strDisplay() {
    let display = 'F['+this.id+']: '+this.name;
    return display;
  }
  toArchive() {
    var archive = {
      id: this.id,
      name: this.name,
    };
    if (this.viewF) {
      archive['viewInfo'] = { pos: {x:this.viewF.left, y:this.viewF.top }};
    }
    else {
      archive['viewInfo'] = null;
    }

    return archive;
  }
}
// ***** to Manage Faction.id
var _idmax_faction = 0;
function makeNewFactionM( name ) {
  return makeNewFactionIdM( _idmax_faction, name );
}
function makeNewFactionIdM( id, name ) {
  if (id < _idmax_faction) {
    alert( "Cannot make new faction with improper id ("+id+")" );
    return;
  }
  var nf = new FactionM( id, name );
  _idmax_faction = id+1;

  return nf;
}
// *************************************************************** END - Faction

// *****************************************************************************
// ******************************************************************** FactionF
// *****************************************************************************
// require: fabric.js, canvas
// IText has NO border (the border is only when selected)
var _colHiglightRGBA = "rgba( 255, 0, 0, 0.2)";
function addFactionF( factionM, posV, colorRGB ) {
  let colRGBA = 'rgba( '+colorRGB[0]+', '+colorRGB[1]+', '+colorRGB[2]+', 0.2)';
  var labelF = new fabric.IText( 'F'+factionM.id+': '+factionM.name, {
    id: factionM.id,
    // model is needed in movedFactionF, to find Relations
    model: factionM,
    elemType: "Faction",
    originX: 'center',
    originY: 'center',
    left: posV.x,
    top: posV.y,
    fontSize: 20,
    fontWeight: 'bold',
    underline: 'true',
    textBackgroundColor: colRGBA,
    copyTextBackgroundColor: colRGBA,
    highlightBackgroundColor: _colHiglightRGBA,
    hasRotatingPoint: false,
    lockRotation: true,
    lockScalingX: true,
    lockSclaingY: true,
    lockSkewingX: true,
    lockSkewingY: true,
    padding: 10,
    // IText
    editable: false,
  });
  _allSelectableF.push( labelF );
  factionM.viewF = labelF;
  
  labelF.on( 'mouseover', function (opt) {
    //console.log( 'MOver' );
    labelF.set( {'textBackgroundColor': labelF.highlightBackgroundColor} );
    canvas.requestRenderAll();
  });
  labelF.on( 'mouseout', function (opt) {
    //console.log( 'MOut' );
    labelF.set( {'textBackgroundColor': labelF.copyTextBackgroundColor} );
    canvas.requestRenderAll();
  });
  // When multiple Objects are selected (like two FactionF)
  // the individual elements DO NOT receive 'moved' or 'modified' event.
  // We have to operate on canvas directly.
  /* labelF.on( 'modified', function (opt) {
   *   console.log( 'EMod', opt );
   *   let allRelationM = findRelationMWith( opt.target.model );
   *   allRelationM.forEach( (itemM,idx) => itemM.viewF.updateEnds() );
   * });
   * labelF.on( 'moved', (opt) => {
   *    console.log( 'moved ', labelF.model.name ); 
   * }); */
  canvas.add( labelF );
  
  return labelF;                               
}
function movedFactionF( itemF ) {
  console.log( 'movedFactionF ', itemF.model.name );
  let allRelationM = findRelationMWith( itemF.model );
  allRelationM.forEach( (itemM,idx) => itemM.viewF.updateEnds() );
}
function editFactionF( labelF, factionM ) {
  labelF.set( {'text' : 'F'+factionM.id+': '+factionM.name } );
}
// ************************************************************** END - FactionF

// *****************************************************************************
// ******************************************************************** FactionC
// *****************************************************************************
// Faction using React
//
// require: react, react-dom, Faction,  
// *****************************************************************************

// ****************************************************************** TextTRComp
// LABEL + INPUT
// - value : text value (default and changed)
// - keyName : unique ref
// - onValueChange : cbk to call when value is changed

const TextCellC = (props) => {
  //const [val, setVal] = React.useState('??');
  /* function handleValueChange() {
   *   console.log( "TextRRFC::handleValueChange" );
   * } */

  const handleValueChange = (event) => {
    props.setValue( event.target.value );
    //props.onValueChange( props.keyName, event.target.value );
  }
  
  return (
    <tr>
      <td><label>{props.title} : </label></td>
      <td>
        <input
          type="text"
          value={props.value}
          onChange={handleValueChange}
        />
      </td>
    </tr>
  );
}
// *****************************************************************************
// ******************************************************************** FactionC
// PROPS: id, name, okCbk, cancelCbk
const NameFactionC = (props) => {
  const [name, setName] = React.useState( props.name );

  const handleBtnOK = () => {
    props.okCbk( name );
  }
  const handleBtnCancel = () => {
    props.cancelCbk();
  }

  var buttonOK = <button onClick={handleBtnOK}>Ok</button>;
  var buttonCancel = <button onClick={handleBtnCancel}>Cancel</button>;

  // render
  return (
    <div>
    <fieldset>
    <legend>Faction ({props.id}) </legend>
    <table>
    <tbody>
    <TextCellC
    title="Name"
    setValue={setName}
              value={name}
    />
          </tbody>
        </table>
      </fieldset>
      {buttonOK}{buttonCancel}
    </div>
  );
}
// ************************************************************** END - FactionC

// *****************************************************************************
// ***************************************************************** ListFaction
// *****************************************************************************
// Require: FactionM, canvas (fabric)
var _listFactionM = [];
function newFactionAction( name, posV ) {
  var newM = makeNewFactionM( name );
  var newF = addFactionF( newM, posV, [0,0,255] );
  _listFactionM.push( newM );
}
function addFactionAction( factionA ) {
  console.log( "addFactionAction", factionA );
  if (factionA.id < 0) {
    alert( "Cannot addFaction with improper id ("+factionA.id+")" );
    return;
  }
  if (_listFactionM[factionA.id]) {
    alert( "Cannot addFaction over existing one (id="+factionA.id+")" );
    return;
  }

  let newM = makeNewFactionIdM( factionA.id, factionA.name );
  let posV = factionA.viewInfo.pos;
  var newF = addFactionF( newM, posV, [0,0,255] );
  _listFactionM.push( newM );
}
function editFactionAction( factionM ) {
  let view = _listFactionM[factionM.id].viewF;
  editFactionF( view, factionM );
  _listFactionM[factionM.id] = factionM;
  canvas.renderAll();
}
function delFactionAction( factionIDX ) {
  console.log( "__delFaction", factionIDX );
  
  if (_listFactionM[factionIDX]) {
    let factionM = _listFactionM[factionIDX];
    if (factionM != null ) {
      // Remove all Relation to this faction
      _listRelationM.forEach( (item, index) => {
        if (item != null) {
          if (item.isRelated( factionM )) {
            delRelationActionL( item.id );
          }
        }
      });
      
      let itemF = _listFactionM[factionIDX].viewF;
      removeFromAllSelectable( itemF );
      canvas.remove( itemF );
      _listFactionM[factionIDX] = null;
    }
  }
  else {
    alert( "Cannot delFaction on non-existing faction" );
  }
}
// *********************************************************** END - ListFaction

// *****************************************************************************
// ******************************************************************* RelationM
// *****************************************************************************
// require: 
class RelationM {
  constructor( id, name, srcFactionM, destFactionM ) {
    this.id = id;
    this.name = name;
    this.srcM = srcFactionM;
    this.destM = destFactionM;
    this.type = 'RelationM';
    this.viewF = null;
  }
  strDisplay() {
    let display = 'R['+this.id+']: '+this.name;
    return display;
  }
  toArchive() {
    var archive = {
      id: this.id,
      name: this.name,
      srcId: this.srcM.id,
      destId: this.destM.id,
    };
    if (this.viewF) {
      archive['viewInfo'] = this.viewF.toArchive();
    }
    else {
      archive['viewInfo'] = null;
    }
    
    return archive;    
  }
  isRelated( factionM ) {
    return (this.srcM === factionM || this.destM === factionM);
  }
}
// ***** to Manage Faction.id
var _idmax_relation = 0;
function makeNewRelationM( name, srcFactionM, destFactionM ) {
  return makeNewRelationIdM( _idmax_relation, name, srcFactionM, destFactionM );
}
function makeNewRelationIdM( id, name, srcFactionM, destFactionM ) {
  console.log( "makeNewRelation ", id, name, srcFactionM, destFactionM );

  if (id < _idmax_relation) {
    alert( "Cannot make new relation with improper id ("+id+")" );
    return;
  }
  var nr = new RelationM( id, name, srcFactionM, destFactionM);
  _idmax_relation = id+1;

  return nr;
}
// ************************************************************* END - RelationM

// *****************************************************************************
// ******************************************************************* Vec {x,y}
// *****************************************************************************
class Vec {
  constructor( x, y ) {
    this.x = x;
    this.y = y;
  }
  norm() {
    return Math.sqrt( this.x * this.x + this.y * this.y );
  }
  minus( v ) {
    return new Vec( this.x - v.x, this.y - v.y );
  }
  dot( v ) {
    return this.x * v.x + this.y * v.y;
  }
  perp() {
    return new Vec( -this.y, this.x );
  }
  scalar( k ) {
    return new Vec( k * this.x, k * this.y );
  }
}
// Hyp : itemF is centered on {left,top}, itemF has width, height
//     : top is bigger when going down
function intersectRectVec( itemF, vec ) {
  let dx, dy;
  let maxX = itemF.left + itemF.width/2;
  let minX = itemF.left - itemF.width/2;
  let maxY = itemF.top + itemF.height/2;
  let minY = itemF.top - itemF.height/2;

  if (Math.abs( vec.y ) < Number.EPSILON) {
    if (vec.x > 0) {
      return new Vec( maxX, itemF.top );
    }
    else {
      return new Vec( minX, itemF.top );
    }
  }

  // right quadrant
  if (vec.x > Number.EPSILON) {
    dx = (maxX - itemF.left);
    dy = (dx / vec.x) * vec.y;
    // right "down" quadrant
    if (dy > (maxY - itemF.top)) {
      dy = (maxY - itemF.top);
      dx = (dy / vec.y) * vec.x;
    }
    // right "up" quadrant
    else if (dy < (minY - itemF.top)) {
      dy = (minY - itemF.top);
      dx = (dy / vec.y) * vec.x;
    }
  }
  // left quadrant
  else if (vec.x < -Number.EPSILON) {
    dx = (minX - itemF.left);
    dy = (dx / vec.x) * vec.y;
    // left "down" quadrant
    if (dy > (maxY - itemF.top)) {
      dy = (maxY - itemF.top);
      dx = (dy / vec.y) * vec.x;
    }
    // left "up" quadrant
    else if (dy < (minY - itemF.top)) {
      dy = (minY - itemF.top);
      dx = (dy / vec.y) * vec.x;
    }
  }
  // vec.x is null
  else {
    if (vec.y > 0) {
      return new Vec( itemF.left, maxY );
    }
    else {
      return new Vec( itemF.left, minY );
    }
  }
  
  return new Vec( itemF.left+dx, itemF.top+dy );
}
// Compute the position of a point at absice 'abs' on segment [src,dest]
function segmentPointVec( srcV, destV, abs ) {
  let x = srcV.x + abs * (destV.x - srcV.x);
  let y = srcV.y + abs * (destV.y - srcV.y);
  return new Vec(x,y);
}
// Compute a bezier point with absice 'abs'
function computeBezierPointVec( srcV, destV, ctrlV, abs ) {
  let pt1 = segmentPointVec( srcV, ctrlV, abs );
  let pt2 = segmentPointVec( ctrlV, destV, abs );
  return segmentPointVec( pt1, pt2, abs );
}
// ******************************************************************* END - Vec

// *****************************************************************************
// ******************************************************************* RelationF
// *****************************************************************************
// require: fabric.js, canvas, Vector
// A RelationF is made of:
// - pathF [fabric.Path] : the bezier path
// - headF [fabric.Triangle] : arrow head
// - ctrlF [fabric.Circle] : ctrl Point for the path
// - midF [???] : point a the middle abscisse of the path
// - labelF [fabric.] : the text, near the mid point
class RelationF {
  constructor( relationM, colRGB ) {
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

    _allSelectableF.push( this.pathF );
    _allSelectableF.push( this.ctrlF );
    
    canvas.add( this.pathF );
    canvas.add( this.headF );
    canvas.add( this.ctrlF );
    canvas.add( this.labelF );
  }
  edit( relationM ) {
    this.labelF.set( {'text' : relationM.id+': '+relationM.name } );
  }
  remove() {
    removeFromAllSelectable( this.pathF );
    removeFromAllSelectable( this.ctrlF );
    
    canvas.remove( this.pathF );
    canvas.remove( this.headF );
    canvas.remove( this.ctrlF );
    canvas.remove( this.labelF );
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
    canvas.setActiveObject( this.ctrlF );
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

// *****************************************************************************
// *************************************************************** ListRelationM
// *****************************************************************************
var _listRelationM = [];
function newRelationAction( name, srcM, destM ) {
  // check different items
  if (srcM === destM) {
    alert( "No Relation with same Element" );
    return;
  }
  var nrM = makeNewRelationM( name, srcM, destM );
  var nrF = new RelationF( nrM, 'red' );
  nrM.viewF = nrF;
  _listRelationM.push( nrM );

  // deselect everything except new relation
  canvas.discardActiveObject();
  nrF.setActive();
}
function addRelationAction( relationA ) {
  console.log( "addRelationAction", relationA );
  if (relationA.id < 0) {
    alert( "Cannot addRelation with improper id ("+relationA.id+")" );
    return;
  }
  if (_listRelationM[relationA.id]) {
    alert( "Cannot addRerlation over existing one (id="+relationA.id+")" );
    return;
  }
  let srcFactionM = _listFactionM[relationA.srcId];
  let destFactionM = _listFactionM[relationA.destId];

  var nrM = makeNewRelationIdM( relationA.id, relationA.name,
                                srcFactionM, destFactionM );
  var nrF = new RelationF( nrM, 'red' );
  nrM.viewF = nrF;
  nrF.setCtrlPt( relationA.viewInfo.posCtrl );
  nrF.setInactive(); 
  _listRelationM.push( nrM );
}
function findRelationMWith( itemM ) {
  let result = [];
  for( let idx=0; idx < _listRelationM.length; idx++ ) {
    let relationM = _listRelationM[idx];
    if (relationM != null) {
      if (relationM.srcM === itemM || relationM.destM === itemM ) {
        result.push( relationM );
      }
    }
  }
  return result;
}
function editRelationActionM( relationM ) {
  let view = relationM.viewF;
  view.edit( relationM );
  _listRelationM[relationM.id] = relationM;
  canvas.renderAll();
}
function delRelationActionL( relationIDX ) {
  console.log( "__delRelation", relationIDX );

  if (_listRelationM[relationIDX]) {
    let relationM = _listRelationM[relationIDX];
    relationM.viewF.remove();
    _listRelationM[relationIDX] = null;
  }
}

function showAllRelationAction() {
  // make new array with data to archive
  let archiveRelation = _listRelationM.map( (item, index) => {
    if (item != null) {
      return {
        relationM: item.toArchive(),
      };
    }
  });

  let doc = JSON.stringify( archiveRelation );
  console.log( "__JSON" );
  console.log( doc );
  return doc;
}


// ********************************************************* END - ListRelationM

// *****************************************************************************
// ******************************************************************* RelationC
// RelationC (RelationM)
//
// require: TextCellC, RelationM

const RelationC = (props) => {
  const [name, setName] = React.useState( props.relationM.name );
  const [from, setFrom] = React.useState( props.relationM.srcM.name );
  const [dest, setDest] = React.useState( props.relationM.destM.name );

  const handleChangeFrom = (value) => {
    console.log( "RelationC::From ", value );
  }
  
  const handleBtnSave = () => {
    console.log( "RelationC::SAVE" );
  }
  
  var buttonSave = <button onClick={handleBtnSave}>Save</button>;
  // render
  return (
    <div>
      <fieldset>
        <legend>Relation ({props.relationM.id}) </legend>
        <table>
          <tbody>
            <TextCellC
              title="Name"
              setValue={setName}
              value={name}
            />
            <TextCellC
              title="From"
              setValue={handleChangeFrom}
              value={from}
            />
            <TextCellC
              title="To"
              setValue={setDest}
              value={dest}
            />
          </tbody>
        </table>
        {buttonSave}
      </fieldset>
    </div>
  );
}
// ************************************************************* END - RelationC

// *****************************************************************************
// ********************************************************************* Actions
// *****************************************************************************
// Require: FactionC, Faction, 
function newaskNewFactionM( obj, posV ) {
  console.log( "newaskNewFactionM ", obj, posV );
  const gotNameCbk = (name) => {
    newFactionAction( name, {x:posV.x, y:posV.y} );
    removeContextElementC();
  }
  const cancelCbk = removeContextElementC;

  showContextElementC( posV.x, posV.y,
                 <NameFactionC
                   id="-1"
                   name="faction_name"
                   okCbk={gotNameCbk}
                   cancelCbk={cancelCbk}
                 />
  );
}
const askNewPersonM = ( x, y ) => {
  alert( "TODO implement askNewPerson");
}
function askNewFactionM( x, y, okCbk, cancelCbk ) {
  showContextElementC( x, y,
                 <NameFactionC
                   id="-1"
                   name="faction_name"
                   okCbk={okCbk}
                   cancelCbk={cancelCbk}
                 />
  );
}       
function askEditFactionL( factionIDX, posV ) {
  let factionM = _listFactionM[factionIDX];
  const editName = (name) => {
    factionM.name = name;
    editFactionAction( factionM );
    removeContextElementC();
  }
  const cancelName = () => {
    removeContextElementC();
  }

  showContextElementC( posV.x, posV.y,
                       <NameFactionC
    id={factionM.idx}
    name={factionM.name}
    okCbk={editName}
    cancelCbk={cancelName}
    />
  );
}

function startRelationFromFactionL( factionIDX, posP ) {
  console.log( 'askNRFF', posP );
  // need to find FactionF related to this factionM
  let factionF = _listFactionM[factionIDX].viewF;
  startDrawArrow( factionF, posP );
}
function askEditRelationL( relationIDX, posV ) {
  let relationM = _listRelationM[relationIDX];
  const editName = (name) => {
    relationM.name = name;
    editRelationActionM( relationM );
    removeContextElementC();
  }
  const cancelName = () => {
    removeContextElementC();
  }
  showContextElementC( posV.x, posV.y,
                       <NameRelationC
    id={relationM.idx}
    name={relationM.name}
    okCbk={editName}
    cancelCbk={cancelName}
    />
  );
}
function askDelRelationL( relationIDX, posV ) {
  // TODO ask for confirmation ?
  delRelationActionL( relationIDX );
}

// *****************************************************************************
// *****************************************************************************
const NameRelationC = (props) => {
  const [name, setName] = React.useState( props.name );
  
  const handleBtnOK = () => {
    props.okCbk( name );
  }
  const handleBtnCancel = () => {
    props.cancelCbk();
  }
  
  var buttonOK = <button onClick={handleBtnOK}>Ok</button>;
  var buttonCancel = <button onClick={handleBtnCancel}>Cancel</button>;
  // render
  return (
    <div>
    <fieldset>
    <legend>Relation ({props.id}) </legend>
    <table>
    <tbody>
    <TextCellC
    title="Name"
    setValue={setName}
              value={name}
    />
          </tbody>
        </table>
      </fieldset>
      {buttonOK}{buttonCancel}
    </div>
  );
}

function askNameRelationM( x, y, okCbk, cancelCbk ) {
  showContextElementC( x, y,
                       <NameRelationC
    id="-1"
    name="relation_name"
    okCbk={okCbk}
    cancelCbk={cancelCbk}
    />
  );
}

function archiveJSONAction() {
  // make new array with data to archive
  let archiveFaction = [];
  _listFactionM.forEach( (item, index) => {
    if (item) {
      archiveFaction.push( {factionA: item.toArchive()} );
    }
  });
  let archiveRelation = [];
  _listRelationM.forEach( (item, index) => {
    if (item) {
      archiveRelation.push( {relationA: item.toArchive()} );
    }
  });

  let archive = {
    factions: archiveFaction,
    relations: archiveRelation
  };
  let doc = JSON.stringify( archive );
  console.log( "__showAllAction in JSON" );
  console.log( doc );
  return doc;
}
function saveAllJSONAction() {
  let doc = archiveJSONAction();
  let jsonBlob = new Blob([doc],
                          { type: 'application/javascript;charset=utf-8' });
  saveAs( jsonBlob, "faction_data.json" );
}
function populateAllFromJSONAction( doc ) {
  let archive = JSON.parse( doc );

  let archiveFaction = archive.factions;
  archiveFaction.forEach( (item, index) => {
    console.log( "["+index+"]=",item );
    if (item.factionA.viewInfo) {
      console.log( "populate with", item.factionA );
      addFactionAction( item.factionA, item.factionA.viewInfo.pos );
      console.log( "_listFactionM size=",_listFactionM.length, _idmax_faction );
    }
    else {
      alert( "Populate Faction from factionA without viewInfo" );
      return;
    }
  });

  let archiveRelation = archive.relations;
  archiveRelation.forEach( (item, index) => {
    console.log( "["+index+"]=",item );
    if (item.relationA.viewInfo) {
      addRelationAction( item.relationA );
    }
    else {
      alert( "Populate Faction from factionA without viewInfo" );
      return;
    }
  });
}
function readAllFromFileAction( file ) {
  // Check right type (application/json)
  if (file.type && file.type.indexOf( 'application/json' ) === -1) {
    alert( "File "+file.name+" is not JSON file" );
    return;
  }

  const reader = new FileReader();
  reader.addEventListener( 'load', (event) => {
    console.log( "__READ loaded" );
    console.log( reader.result );
    populateAllFromJSONAction( reader.result );
  });
  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`__READ Progress: ${Math.round(percent)}`);
    }
  });
  reader.readAsText(file); // when finished, will throw 'load'
}
// *************************************************************** END - Actions

// *****************************************************************************
// **************************************************************** Context Menu
// *****************************************************************************
const handleDummy = ( obj, pos ) => {
  console.log( "DUMMY", obj, pos );
}
var _createContextMenu = [
  {label:"New Faction", cbk:newaskNewFactionM}, //( x, y, okCbk, cancelCbk )},
  {label:"New Person", cbk:askNewPersonM}   // ??
];
var _factionContextMenu = [
  {label:"Edit", cbk:askEditFactionL},
  {label:"New Relation", cbk:startRelationFromFactionL},
  {label:"<hr>",cbk:null}, // separator
  {label: "Delete", cbk:delFactionAction} // TODO ask ?
];
var _relationContextMenu = [
  {label:"Edit", cbk:askEditRelationL},
  {label:"<hr>",cbk:null}, // separator
  {label: "Delete", cbk:askDelRelationL}
]


// Creation Menu
// call cbk( pos )
const CreationMenu = (props) => {

  // Build menu Items
  const listItems = props.items.map( (item, index) => {
    if (item.label === "<hr>") {
      return(<hr key={index}/>);
    }
    return (
      <span
        key={index}
        onClick={() =>  {
          removeContextElementC();
          item.cbk(props.pos.x, props.pos.y)
        }}
      >
        {item.label}
      </span>
    );
  });

  return (
    <div className="vertical_menu">
    {listItems}
    </div>
  );
}

// FactionM, pos (x,y), 
// items = [ {label, cbk] OR {label:"<hr>", cbk:null} for sep ]
//
// will call cbk( factionM, pos )
const FactionMenu = (props) => {

  // Build menu Items
  const listItems = props.items.map( (item, index) => {
    if (item.label === "<hr>") {
      return(<hr key={index}/>);
    }
    return (
      <span
        key={index}
        onClick={() =>  {
          removeContextElementC();
          item.cbk(props.factionIDX, props.pos)
        }}
      >
        {item.label}
      </span>
    );
  });
 
  return (
    <div className="vertical_menu">
    {listItems}
    </div>
  );
}
// PROPS: msg=String, elemIDX=int, pos={x,y}, items=[{label, cbk}]
const ContextMenuC = (props) => {

  // Build menu Items
  const listItems = props.items.map( (item, index) => {
    if (item.label === "<hr>") {
      return(<hr key={index}/>);
    }
    return (
      <span
        key={index}
        onClick={() =>  {
          removeContextElementC();
          item.cbk(props.elemIDX, props.pos)
        }}
      >
        {item.label}
      </span>
    );
  });
  
  // render
  return (
    <div className="vertical_menu">
    <h2>
    {props.msg}
    </h2>
      {listItems}
    </div>
  );
}

var contextMenuE = document.getElementById( 'context_menu' );
// to prevent 'context menu for showing off
contextMenuE.addEventListener( 'contextmenu', function(event) {
  //console.log( "contextMenu contextmenu", event.buttons );
  event.preventDefault();
  event.stopPropagation();
},
                               true /* capture */
);
function displayContextMenu( flag ) {
  if (flag) {
    contextMenuE.style.display = "block";
    allSetSelectable( false );
  }
  else {
    contextMenuE.style.display = "none";
    allSetSelectable( true );
  } 
}

var _contextPopupE;
function showContextMenuC( elemIDX, x, y, msg, menuItems ) {
  showContextElementC( x, y,
                       <ContextMenuC
    elemIDX={elemIDX}
    pos={{x:x, y:y}}
    msg={msg}
    items={menuItems}
    />
  );
}
function showContextElementC( x, y, elemC ) {
  console.log( "showContextElementC", x, y, elemC );
  setPopable( false );
  _contextPopupE = document.createElement( "DIV" );
  contextMenuE.appendChild( _contextPopupE );

  contextMenuE.style.left = x + 'px';
  contextMenuE.style.top = y + 'px';

  ReactDOM.render( elemC, _contextPopupE );
  displayContextMenu( true );
}

function removeContextElementC() {
  console.log( "removeContextElementC");
  _contextPopupE.remove();
  displayContextMenu( false );
  setPopable( true );
}
// ************************************************************ END Context Menu

// *****************************************************************************
// ******************************************************************* DrawArrow
// *****************************************************************************
var _stateDA = "none"; // none | drawing
var _srcFDA = null;
var _lineDA;
function startDrawArrow( srcF, mouseP ) {
  _stateDA = "drawing";
  _srcFDA = srcF;
  // Create a new line from srcF.left/top to mouseP.x/y
  _lineDA = new fabric.Line( [srcF.left, srcF.top, mouseP.x, mouseP.y ], {
    stroke: 'red',
    selectable: false,
  });
  canvas.add( _lineDA );
  // cannot select anything
  allSetSelectable( false );
}
function updateDrawArrow( mouseP ) {
  // Update line to mouseP.x/y
  _lineDA.set( {'x2': mouseP.x, 'y2': mouseP.y} );
  //_lineDA.setCoords();
  //_lineDA.set('dirty', true);
  canvas.requestRenderAll();
}
function abortDrawArrow() {
  console.log( "abortDA" );
  _stateDA = "none";
  _srcFDA = null;
  canvas.remove( _lineDA );
  allSetSelectable( true );
}
function endDrawArrow( x, y, itemF ) {
  console.log( "endDA", itemF );
  // check it is a Faction
  if (itemF.model && itemF.model.type === "FactionM" ) {
    _stateDA = "none";

    // ask for a Name
    const gotName = (name) => {
      console.log( "endARROW => newRelation", name );
      canvas.remove( _lineDA );
      newRelationAction( name, _srcFDA.model, itemF.model );

      removeContextElementC();
      allSetSelectable( true );
    }
    const cancelName = () => {
      console.log( "endARROW => abort" );

      abortDrawArrow();
      removeContextElementC();
    }
    askNameRelationM( x, y, gotName, cancelName );
  }
  else {
    return abortDrawArrow();
  }
}
function isDrawArrow() {
  return _stateDA === "drawing";
}
// *************************************************************** END DrawArrow

// *****************************************************************************
// **************************************************************** Fabric utils
// *****************************************************************************
// Compute position of a FabricItem, even if nested in a group/selection.
// Requirement: group.originX: left, group.originY. top
//
// Returns {left, top, width, height}
function getPosF( item ) {
  let left = item.left;
  let top = item.top;
  // in group ??
  if (item.group) {
    let gPos = getPosF( item.group );
    left += gPos.left + item.group.width/2;
    top += gPos.top + item.group.height/2;
  }
  return {left:left, top:top, width:item.width, height:item.height };
}
// ************************************************************ END Fabric Utils

// *****************************************************************************
// ************************************************************* Fabric Callback
// *****************************************************************************
// Require: Action, fabric
canvas.on( 'mouse:down', function (opt) {
  console.log( 'canvas.mouse:down',opt, _allowPopup );
  if (opt.e.button === 0) {
    if (opt.target === null) {
      // while drawingArrow
      if (isDrawArrow()) {
        console.log( "ED 1 display null" );
        abortDrawArrow();
        return;
      }
    }
    else {
      // while drawingArrow
      if (isDrawArrow()) {
        console.log( "ED 1 display target" );
        endDrawArrow( opt.e.x, opt.e.y, opt.target );
        return
      }
    }
  }
  // RightClick
  if (opt.e.button === 2) {
    if (opt.target === null) {
      // while drawingArrow
      if (isDrawArrow()) {
        console.log( "ED 2 display null" );
        abortDrawArrow();
        return;
      }
      // if already popping then abort also
      if ( _allowPopup === false ) {
        removeContextElementC();
      }
      else {
        //use mouseEvent to know absolute position
        showContextMenuC( null, opt.e.x, opt.e.y,
                            "Creation Menu", _createContextMenu );
        /* askNewFactionM( opt.e.x, opt.e.y,
         *                 // okCbk
         *                 (name) => {
         *                   newFactionAction( name, {x:opt.e.x, y:opt.e.y} );
         *                   removeContextElementC();
         *                 },
         *                 // cancelCbk
         *                 () => {
         *                   removeContextElementC();
         *                 }); */
        //opt.e.preventDefault(); // no propagation of mouse event
        //opt.e.stopPropagation();
      }
    }
    else {
      // a Faction
      if (opt.target.elemType === "Faction") {
        // while drawingArrow
        if (isDrawArrow()) {
          console.log( "ED 2 display target" );
          endDrawArrow( opt.e.x, opt.e.y, opt.target );
          return
        }
        // console.log( "RC: ",opt );
        // console.log( "  F:",_listFaction[opt.target.id] );
        if (_allowPopup) {
          showContextMenuC( opt.target.id, opt.e.x, opt.e.y,
                            "Faction Menu", _factionContextMenu );
        }
      }
      else if (opt.target.elemType === "Relation") {
        // while drawingArrow
        if (isDrawArrow()) {
          abortDrawArrow();
          return
        }

        // ContextMenu for Relation
        if (_allowPopup) {
          showContextMenuC( opt.target.id, opt.e.x, opt.e.y,
                            "Relation Menu", _relationContextMenu );
        }
      }
      else {
        console.log( "RClick on ", opt.target );
        alert( "RClick on what ?" );
      }
    }
  }
  // Middle click
  if (opt.e.button === 1) {
    alert( "X="+opt.e.x+", Y="+opt.e.y );
  }
});
canvas.on( 'mouse:move', function (opt) {
  //console.log( 'M', opt );
  if (isDrawArrow()) {
    console.log( "M udateDrawArrow", opt.absolutePointer );
    updateDrawArrow( opt.absolutePointer);
  }
});

canvas.on( 'object:moved', (opt) => {
  // opt.target is an ActiveSelection or a 'rawObject'
  console.log( 'object:moved', opt );
  //console.log( '  moved ', opt.target.type );
  //console.log( '  moved ', typeof(opt.target) );

  if (opt.target.type === "activeSelection" ) {
    console.log( '  moving activeSelection', opt.target );
    opt.target.forEachObject( (itemF, idx) => {
      if (itemF.model.type === "FactionM") {
        movedFactionF( itemF );
      }
    });
  }
  else if (opt.target.model && opt.target.model.type === "FactionM") {
    movedFactionF( opt.target );
  }
});

/* canvas.on( 'mouse:up', function (opt) {
 *   //console.log( 'U', opt );
 *   if (opt.e.button === 2) {
 *     if (_stateDA === "drawing") {
 *       console.log( "U endDrawArrow" );
 *       _stateDA = "none";
 *     }
 *   }
 * });*/
// ******************************************************* End - Fabric Callback


//console.log( 'VERSION=',fabric.version );

// *****************************************************************************
// ********************************************************************* Buttons
function btnInfo() {
  console.log( "_listFactionM size=",_listFactionM.length, _idmax_faction );
  archiveJSONAction();
}
function btnSave() {
  saveAllJSONAction();
}
function btnLoad(event) {
  console.log( "__Load e=",event );
  readAllFromFileAction( event.target.files[0] );
}
// ***************************************************************** END Buttons
