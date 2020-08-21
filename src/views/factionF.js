import {fabric} from 'fabric';
import {Vec} from '../utils/vec';
import {addToAllSelectable} from '../utils/select_pop';

/*
import {addFactionF, movedFactionF, editFactionF} from 'path/factionF';
*/
// *****************************************************************************
// ******************************************************************** FactionF
// *****************************************************************************
// require: fabric.js, canvas
// IText has NO border (the border is only when selected)
var _colHiglightRGBA = "rgba( 255, 0, 0, 0.2)";
export function addFactionF( canvas, factionM, posV ) {
  let colorRGB = factionM.color;
  let colRGBA = 'rgba( '+colorRGB.r+', '+colorRGB.g+', '+colorRGB.b+', 0.2)';
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
  addToAllSelectable( labelF );
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
export function editFactionF( labelF, factionM ) {
  let colorRGB = factionM.color;
  let colRGBA = 'rgba( '+colorRGB.r+', '+colorRGB.g+', '+colorRGB.b+', 0.2)';

  labelF.set( {
    'text' : 'F'+factionM.id+': '+factionM.name,
    'textBackgroundColor' : colRGBA,
    'copyTextBackgroundColor' : colRGBA,
              } );
}
// ************************************************************** END - FactionF
