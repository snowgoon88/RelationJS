
/*
import { ListModelM } from 'path/list_modelM';
*/

// *****************************************************************************
// ****************************************************************** ListModelM
export class ListModelM {
  constructor() {
    this.data = [];
  }

  getLength() { return this.data.length; }

  getModelL( modelIDX ) {
    return this.data[modelIDX];
  }
  /** Return only non-null ModelM */
  getListModelM() {
    return this.data.filter( (item) => item != null );;
  }
  /** Apply only on non-null ModelM */
  forEachModelM( funCbk ) {
    this.getListModelM().forEach( funCbk );
  }

  addModelM( modelM ) {
    if (modelM.id < 0) {
      alert( "Cannot addModelM with improper id ("+modelM.id+")" );
      return;
    }
    if (this.data.[modelM.id]) {
      alert( "Cannot addModelM over existing one (id="+modelM.id+")" );
      return;
    }
    this.data.push( modelM );
  }

  editModelL( id, modelM ) {
    // check Id
    if( id != modelM.id ) {
      alert( "Cannot editModelL with mismatch id ("+id+", "+modelM.id+")" );
      return;
    }
    if( this.getModelL( id ) == null ) {
      alert( "Cannot editModelL over null id ("+id+")" );
      return;
    }
    this.data.[id] = modelM;
  }

  delModelL( modelIDX ) {
    console.log( "__delModelF", modelIDX );

    if( this.data.[modelIDX] ) {
      let modelM = this.data[modelIDX];
      modelM.viewF.remove();
      this.data.[modelIDX] = null;
    }
  }
}
// ************************************************************ END - ListModelM
