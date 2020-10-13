import {fabric} from 'fabric';
import {Vec} from '../utils/vec';
import { addToAllSelectable, removeFromAllSelectable } from '../utils/select_pop';
import { getPosF } from './utils';
/*
import { FactionF } from 'path/factionF';
*/
// *****************************************************************************
// ******************************************************************** FactionF
// *****************************************************************************
// require: fabric.js, canvas
// IText has NO border (the border is only when selected)
var _colHiglightRGBA = "rgba( 255, 0, 0, 0.2)";
export class FactionF {
  constructor( canvas, factionM, posV ) {
    this.canvas = canvas;
    this.id = factionM.id;
    this.model = factionM;
    this.elemType = 'Faction';
    
    let colorFaction = factionM.color;
    let colRGBA = 'rgba( '+colorFaction.r+', '+colorFaction.g+', '+colorFaction.b+', 1.0)';
    let colTransRGBA = 'rgba( '+colorFaction.r+', '+colorFaction.g+', '+colorFaction.b+', 0.2)';
    this.labelF = new fabric.IText( 'F'+factionM.id+': '+factionM.name, {
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
      //underline: 'true',
      //borderColor: colRGBA,
      //borderScaleFactor: 2,
      // textBackgroundColor: colRGBA,
      // copyTextBackgroundColor: colRGBA,
      highlightBackgroundColor: _colHiglightRGBA,
      hasRotatingPoint: false,
      hasCongtrols: false,
      lockRotation: true,
      lockScalingX: true,
      lockSclaingY: true,
      lockSkewingX: true,
      lockSkewingY: true,
      padding: 10,
      // IText
      editable: false,
    });
  
    this.labelF.on( 'mouseover', (opt) => {
      //console.log( 'MOver' );
      this.labelF.set( {'textBackgroundColor': this.labelF.highlightBackgroundColor} );
      this.canvas.requestRenderAll();
    });
    this.labelF.on( 'mouseout', (opt) => {
      //console.log( 'MOut' );
      //this.labelF.set( {'textBackgroundColor': this.labelF.copyTextBackgroundColor} );
      this.labelF.set( {'textBackgroundColor': 'white'} );
      this.canvas.requestRenderAll();
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

    // then a Rect as a border
    this.borderF = new fabric.Rect( {
      width: this.labelF.width * 1.1,
      height: this.labelF.height * 1.1,
      stroke: colRGBA,
      strokeWidth: 6,
      fill: 'rgba(1,1,1,0)',
      id: factionM.id,
      // model is needed in movedFactionF, to find Relations
      model: factionM,
      elemType: "Faction",
      originX: 'center',
      originY: 'center',
      left: posV.x,
      top: posV.y,
      hasControls: false,
      hasBorder: false,
      selectable: false,
    });

    // and another Rect for the overallBBox
    this.expandedF = new fabric.Rect( {
      id: factionM.id,
      // model is needed in movedFactionF, to find Relations
      model: factionM,
      elemType: "Faction",
      originX: 'center',
      originY: 'center',
      left: posV.x,
      top: posV.y,
      hasControls: false,
      hasBorder: false,
      selectable: false,

      width: 10,
      height: 10,
      fill: colTransRGBA,
      visible: false,
    });
    
    addToAllSelectable( this.labelF );
    this.canvas.add( this.borderF );    
    this.canvas.add( this.labelF );
    this.canvas.add( this.expandedF );
    this.expandedF.sendToBack();
    this.objF = this.labelF;
    
    factionM.viewF = this; // TODO legit ?
  }
  edit( factionM ) {
    let colorRGB = factionM.color;
    let colRGBA = 'rgba( '+colorRGB.r+', '+colorRGB.g+', '+colorRGB.b+', 0.2)';

    this.labelF.set( {
      'text' : 'F'+factionM.id+': '+factionM.name,
      'textBackgroundColor' : colRGBA,
      'copyTextBackgroundColor' : colRGBA,
    } );
  }
  remove() {
    removeFromAllSelectable( this.labelF );
    this.canvas.remove( this.labelF );
    this.canvas.remove( this.borderF );
    this.canvas.remove( this.expandedF );
  }
  toArchive() {
    var archive = {
      pos: {x: this.labelF.left, y: this.labelF.top}
    };
    return archive;
  }
  // this.labelF has moved, move this.borderF
  updatePos() {
    // need the 'real' position of this.labelF
    let posLabel = getPosF( this.labelF );
    this.borderF.set( {'left': posLabel.left, 'top': posLabel.top} );
  }
  isExpanded() {
    return this.expandedF.get( 'visible' );
  }
  expand( listChildrenM, flag ) {
    if( flag == false ) {
      this.expandedF.set( {'visible': false } );
    }
    else {
      let bbox = this._overallBBox( listChildrenM );
      let rectWidth = bbox.xmax - bbox.xmin;
      let rectX = bbox.xmin + rectWidth / 2;
      let rectHeight = bbox.ymax - bbox.ymin;
      let rectY = bbox.ymin + rectHeight / 2;
      this.expandedF.set( {
        'left': rectX, 'top': rectY,
        'width': rectWidth, 'height': rectHeight,
        'visible': true,
      });
    }
  }
  // compute the BBox of this and all Persons
  _overallBBox( listChildrenM ) {
    console.log( "__FactionF._overallBBox listChildrenM=", listChildrenM );
    // start with this.labelF
    let posLabel = getPosF( this.labelF );
    let bbox = {
      xmin: posLabel.left - posLabel.width/2,
      xmax: posLabel.left + posLabel.width/2,
      ymin: posLabel.top - posLabel.height/2,
      ymax: posLabel.top + posLabel.height/2,
    };
    // now for all Persons of this.model
    listChildrenM.forEach( (model,idx) => {
      let pos = getPosF( model.viewF.objF );
      bbox = {
        xmin: Math.min( bbox.xmin, pos.left - pos.width/2 ),
        xmax: Math.max( bbox.xmax, pos.left + pos.width/2 ),
        ymin: Math.min( bbox.ymin, pos.top - pos.height/2 ),
        ymax: Math.max( bbox.ymax, pos.top + pos.height/2 ),
      };
    });
    return bbox;
  }
}
// ************************************************************** END - FactionF
