import {fabric} from 'fabric';
import {Vec} from '../utils/vec';
import { addToAllSelectable, removeFromAllSelectable } from '../utils/select_pop';

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
    
    let colorRGB = factionM.color;
    let colRGBA = 'rgba( '+colorRGB.r+', '+colorRGB.g+', '+colorRGB.b+', 0.2)';
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
  
    this.labelF.on( 'mouseover', (opt) => {
      //console.log( 'MOver' );
      this.labelF.set( {'textBackgroundColor': this.labelF.highlightBackgroundColor} );
      this.canvas.requestRenderAll();
    });
    this.labelF.on( 'mouseout', (opt) => {
      //console.log( 'MOut' );
      this.labelF.set( {'textBackgroundColor': this.labelF.copyTextBackgroundColor} );
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
    addToAllSelectable( this.labelF );
    this.canvas.add( this.labelF );
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
  }
  toArchive() {
    var archive = {
      pos: {x: this.labelF.left, y: this.labelF.top}
    };
    return archive;
  }
}
// ************************************************************** END - FactionF
