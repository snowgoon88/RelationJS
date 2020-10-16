/*
import { ElementF } from 'path/elementF';
*/
// *****************************************************************************
// ******************************************************************** ElementF
export class ElementF {
  constructor( canvas, id, model, elemType ) {
    this.canvas = canvas;
    this.id = id;
    this.model = model;
    this.elemType = elemType;
  }

  /** set id, model, elemType of a FabricJS item */
  setElement( itemF ) {
    itemF.set( {
      'id': this.id,
      'model': this.model,
      'elemType': this.elemType
    });
  }
  /** set FabricJS item as not deformable */
  setNotDeformable( itemF ) {
    itemF.set( {
      'hasRotatingPoint': false,
      'hasControls': false,
      'lockRotation': true,
      'lockScalingX': true,
      'lockSclaingY': true,
      'lockSkewingX': true,
      'lockSkewingY': true
    });
  }
  /** set FabricJS item as not selectable */
  setNotSelectable( itemF ) {
    itemF.set( {
      'hasControls': false,
      'hasBorder': false,
      'selectable': false,
    });
  }
  
  /** return a string FabricJS string representation of color */
  toRGBA( colorRGB, a ) {
    return 'rgba( '+colorRGB.r+', '+colorRGB.g+', '+colorRGB.b+', '+a+')';
  }
}
// **************************************************************** END ElementF
