import {fabric} from 'fabric';
import { addToAllSelectable, removeFromAllSelectable } from '../utils/select_pop';
import { colorToRGBAString } from '../utils/color.js';
import {Vec} from '../utils/vec';
import { ElementF } from './elementF';
/*
import {PersonF} from 'path/personF';
*/

// *****************************************************************************
// ********************************************************************* PersonF
// TODO: add colored circles
var _colHiglightRGBA = "rgba( 255, 0, 0, 0.2)";
var _colDefaultRGBA = {r:255, g:255, b:255, a:1};
export class PersonF extends ElementF {
  constructor( canvas, personM, posV ) {
    super( canvas, personM.id, personM, 'Person' );

    // FabricJS elements
    this.labelF = new fabric.Text( 'P'+personM.id+': '+personM.name, {

      //originX: 'center',
      originY: 'center',
      left: posV.x+20,
      top: posV.y,
      fontSize: 20,
      textBackgroundColor: 'rgba( 255, 255, 255, 1)',
      copyTextBackgroundColor: 'rgba( 255, 255, 255, 1)',
      highlightBackgroundColor: _colHiglightRGBA,
      
      padding: 10,
    });

    // Gather color from faction
    this.factionsColor = personM.listFactionM.map( (item,idx) => item.color );
    if( this.factionsColor.length === 0 ) {
      this.factionsColor.push( _colDefaultRGBA );
    }
    // Colored Pie for Factions
    //let tmpColor = [ 'red', 'blue', 'green' ];//, 'black' ];
    let angle = Math.PI * 2 / this.factionsColor.length;
    let startAngle = -Math.PI / 2.0;
    console.log( "  PersonF pieAngle=", angle, angle/Math.PI*180.0 );
    this.itemsF = [this.labelF];
    // The trick is to draw a circle with large stroke. Filling does not
    // work as it draws arcs.
    this.factionsColor.forEach( (item,idx) => {
      let colorRGBA = Object.assign({}, item);
      colorRGBA.a = 1.0;
      let colorString = colorToRGBAString( colorRGBA );
      let tmpSliceOfPieF = new fabric.Circle( {
        originX: 'center',
        originY: 'center',
        left: posV.x,
        top: posV.y,
        radius: 5,
        startAngle: startAngle,
        endAngle: startAngle + angle,
        stroke : colorString,
        strokeWidth: 12,
        fill : 'black',
       
      });
      this.itemsF.push( tmpSliceOfPieF );

      startAngle += angle;
    });

    this.groupF = new fabric.Group( this.itemsF, {
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
    
    addToAllSelectable( this.groupF );
    this.canvas.add( this.groupF );

    this.objF = this.groupF;
    personM.viewF = this;
    // TODO check this is legit ?
  }
  edit( personM ) {

    let debugObject = (group) => {
      console.log( "DEBUG group" );
      group.getObjects().forEach( (objF,idx) => {
        console.log( "  obj["+idx+"]=",JSON.parse(JSON.stringify(objF)) );
      });
    }

    this.updateTextGroup( this.groupF, this.labelF,
                          'P'+personM.id+': '+personM.name } );
    // this.labelF.set( {'text' : 'P'+personM.id+': '+personM.name } );
    // this.labelF.initDimensions(); // update width and height
    // this.groupF.addWithUpdate();  // for the group
    
    // new factionsColor ?
    let newColors = personM.listFactionM.map( (item,idx) => item.color );
    if( newColors.length === 0 ) {
      newColors.push( _colDefaultRGBA );
    }
    if( JSON.stringify(newColors) != JSON.stringify(this.factionsColor) ) {
      this.factionsColor = newColors;
      // store position within group
      let posV = new Vec( this.itemsF[1].left, this.itemsF[1].top );
      
      console.log( "PersonF.edit changing Pies" );
      debugObject( this.groupF );
      // must remove all previous pies from group
      console.log( "Removing items=",JSON.parse(JSON.stringify(this.itemsF)) );
      // as remove from groupF deletes the element, it changes itemsF I guess
      while( this.itemsF.length > 1) {
        let itemToDelete = this.itemsF.pop();
        console.log( "  remove obj=",JSON.parse(JSON.stringify(itemToDelete)) );
        this.groupF.remove( itemToDelete );
      }
      // this.itemsF.forEach( (item,index) => {
      //   console.log( "  obj["+index+"]=",JSON.parse(JSON.stringify(item)) );
      //   if( index > 0) {
      //     this.groupF.remove( item );
      //     console.log( "  remove obj=",JSON.parse(JSON.stringify(item)) );
      //   }
      // });
      debugObject( this.groupF );
      
      this.itemsF = [this.labelF];
       // Colored Pie for Factions
      //let tmpColor = [ 'red', 'blue', 'green' ];//, 'black' ];
      let angle = Math.PI * 2 / this.factionsColor.length;
      let startAngle = -Math.PI / 2.0;
      console.log( "  PersonF pieAngle=", angle, angle/Math.PI*180.0 );
      // The trick is to draw a circle with large stroke. Filling does not
      // work as it draws arcs.
      this.factionsColor.forEach( (item,idx) => {
        console.log( "  pie from",startAngle,"to", startAngle + angle );
        let colorRGBA = Object.assign({}, item);
        colorRGBA.a = 1.0;
        let colorString = colorToRGBAString( colorRGBA );
        let tmpSliceOfPieF = new fabric.Circle( {
          originX: 'center',
          originY: 'center',
          left: posV.x,
          top: posV.y,
          radius: 5,
          startAngle: startAngle,
          endAngle: startAngle + angle,
          stroke : colorString,
          strokeWidth: 10,
          //fill : item,
       
        });
        this.itemsF.push( tmpSliceOfPieF );
        this.groupF.add( tmpSliceOfPieF );

        startAngle += angle;
      });
      debugObject( this.groupF );
    }
  }
  remove() {
    removeFromAllSelectable( this.groupF );
    
    this.canvas.remove( this.groupF );
  }
  toArchive() {
    var archive = {
      pos: {x: this.groupF.left, y: this.groupF.top}
    };
    return archive;
  }
}
// *************************************************************** END - PersonF
