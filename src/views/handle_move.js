

/*
import { HandeMoveF, HandleEditF } from 'path/handle_move.js';
*/

/**
 * When objectF are moved, need to tell other objects so that everything is updated
 *
 * FactionF => FactionF as expanded,border; RelationF as Ends have moved
 * RelationF => 
 * PersonF => FactionF as expanded
 *
 * then have object update
 * FactionF : expanded; border
 * PersonF
 * RelationF : computeEnds
*/
export class HandleMoveF {
  constructor( listOfAllPersonM, findRelationMWithFunc ) {
    this.listPersonM = listOfAllPersonM;
    this.findRelationMWith = findRelationMWithFunc;

    this.factionFtoUpdate = new Set();
    this.relationFtoUpdate = new Set();
    this.personFtoUpdate = new Set();
  }

  // itemF can be a single item or a group or a selection of these
  hasMoved( movedF ) {
    this.factionFtoUpdate.clear();
    this.relationFtoUpdate.clear();
    this.personFtoUpdate.clear();
    
    // STEP 1 - build update Set    
    // A Selection or a Group
    if( movedF.type === "activeSelection" ) {
      console.log( '  moving activeSelection', movedF );
      movedF.forEachObject( (itemF, idx) => {
        if( itemF.model.type === "FactionM" ) {
          this.addFactionFtoUpdate( itemF.model.viewF );
        }
        else if( itemF.model.type === "PersonM" ) {
          this.addPersonFtoUpdate( itemF.model.viewF );
        }
      });
    }
    // FactionM
    else if( movedF.model && movedF.model.type === "FactionM" ) {
      console.log( "  moved FactionM", movedF.model );
      this.addFactionFtoUpdate( movedF.model.viewF );
    }
    // PersonM
    else if( movedF.model && movedF.model.type === "PersonM" ) {
      console.log( "  moved PersonM ", movedF.model );
      this.addPersonFtoUpdate( movedF.model.viewF );
    }

    console.log( "END of STEP 1****************************" );
    console.log( "  factionUp", this.factionFtoUpdate );
    console.log( "  relationUp", this.relationFtoUpdate );

    // FactionF : expanded; border
    this.factionFtoUpdate.forEach( (factionF) => {
      // Expanded if needed
      if( factionF.isExpanded() ) {
        // find all its "children" (PersonM of that factionM)
        let listChildrenM = this.listPersonM.getListModelM().filter( (personM) => {
          return personM.listFactionM.includes( factionF.model );
        });
      factionF.expand( listChildrenM, true );
      }
    });

    // RelationF : update Ends
    this.relationFtoUpdate.forEach( (relationF) => relationF.updateEnds() );

    // PersonF : nothing
    
  }

  addFactionFtoUpdate( factionF ) {
    this.factionFtoUpdate.add( factionF );
    // update the Set of relationM that need update later
    let linkedRelationM = this.findRelationMWith( factionF.model );
    linkedRelationM.forEach( (relationM) => {
      this.addRelationFtoUpdate( relationM.viewF );
    });
  }
  addRelationFtoUpdate( relationF ) {
    this.relationFtoUpdate.add( relationF );
  }
  addPersonFtoUpdate( personF ) {
    this.personFtoUpdate.add( personF );
    // need also add linked FactionM that are expanded
    personF.model.listFactionM.forEach( (factionM) => {
      if( factionM.viewF.isExpanded() ) {
        this.addFactionFtoUpdate( factionM.viewF );
      }
    });
  }
}

// *****************************************************************************
export class HandleEditF {
  constructor( listOfAllPersonM, findRelationMWithFunc ) {
    this.listPersonM = listOfAllPersonM;
    this.findRelationMWith = findRelationMWithFunc;
  }

  // itemF can be a single item or a group or a selection of these
  hasEdited( editedF ) {
    // Can only handle FactionM
    // FactionM
    if( editedF.model && editedF.model.type === "FactionM" ) {
      console.log( "  edited FactionM", editedF.model );

      // updated Expanded if needed
      let factionM = editedF.model;
      let listChildrenM = this.listPersonM.getListModelM().filter( (personM) => {
          return personM.listFactionM.includes( factionM );
        });
      editedF.expand( listChildrenM, true );
    }
  }
}    
