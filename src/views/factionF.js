import {fabric} from 'fabric';
import {Vec} from '../utils/vec';
import { addToAllSelectable, removeFromAllSelectable } from '../utils/select_pop';
import { getPosF } from './utils';
import { ElementF } from './elementF';
/*
import { FactionF } from 'path/factionF';
*/
// *****************************************************************************
// ******************************************************************** FactionF
// *****************************************************************************
// require: fabric.js, canvas
// IText has NO border (the border is only when selected)
var _colHighlightRGBA = "rgba( 255, 0, 0, 0.2)";
export class FactionF extends ElementF {
  constructor( canvas, factionM, posV ) {
    super( canvas, factionM.id, factionM, 'Faction' );

    this.colRGBA = this.toRGBA( factionM.color, 1.0 );
    this.colTransRGBA = this.toRGBA( factionM.color, 0.2 );

    this.labelF = new fabric.IText( 'F'+factionM.id+': '+factionM.name, {
      originX: 'center',
      originY: 'center',
      left: posV.x,
      top: posV.y,

      fontSize: 20,
      fontWeight: 'bold',

      highlightBackgroundColor: _colHighlightRGBA,

      padding: 10,
      // IText
      editable: false,
    });
    this.setElement( this.labelF );
    this.setNotDeformable( this.labelF );

    // then a Rect as a border
    this.borderF = new fabric.Rect( {
      width: this.labelF.width * 1.1,
      height: this.labelF.height * 1.1,
      stroke: this.colRGBA,
      strokeWidth: 6,
      fill: 'rgba(1,1,1,0)',

      originX: 'center',
      originY: 'center',
      left: posV.x,
      top: posV.y,
    });
    this.setElement( this.borderF );
    this.setNotSelectable( this.borderF );

    // A group with label+border
    this.groupF = new fabric.Group( [this.labelF, this.borderF], {
      originX: 'center',
      originY: 'center',
      left: posV.x,
      top: posV.y,
    });
    this.setElement( this.groupF );
    this.setNotDeformable( this.groupF );

    this.groupF.on( 'mouseover', (opt) => {
      //console.log( 'MOver' );
      this.labelF.set( {'textBackgroundColor': this.labelF.highlightBackgroundColor} );
      this.canvas.requestRenderAll();
    });
    this.groupF.on( 'mouseout', (opt) => {
      //console.log( 'MOut' );
      this.labelF.set( {'textBackgroundColor': this.labelF.copyTextBackgroundColor} );
      this.canvas.requestRenderAll();
    });
    
    // and another Rect for the overallBBox
    this.expandedF = new fabric.Rect( {
      originX: 'center',
      originY: 'center',
      left: posV.x,
      top: posV.y,

      width: 10,
      height: 10,
      fill: this.colTransRGBA,
      visible: false,
    });
    this.setElement( this.expandedF );
    this.setNotSelectable( this.expandedF );

    addToAllSelectable( this.groupF );
    this.canvas.add( this.groupF );
    this.canvas.add( this.expandedF );
    this.expandedF.sendToBack();
    this.objF = this.groupF;
    
    factionM.viewF = this; // TODO legit ?
  }
  edit( factionM ) {
    // In case, text was updated
    this.updateTextGroup( this.groupF, this.labelF,
                          'F'+factionM.id+': '+factionM.name );
    // update border size
    this.borderF.set( {
      'width': this.labelF.width * 1.1,
      'height': this.labelF.height * 1.1,
    });
    this.groupF.addWithUpdate();  // for the group

    // and in case color was changed.
    this.borderF.set( {
      'stroke' : this.colRGBA
    });
    this.expandedF.set( {
      'fill' : this.colTransRGBA
    });
      
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
    let posLabel = getPosF( this.groupF );
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
