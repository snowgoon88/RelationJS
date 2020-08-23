
/*
import {PersonM,  getIdMaxPerson,
        makeNewPersonM, makeNewPersonIdM} from 'path/personM';
*/

// *****************************************************************************
// ********************************************************************* PersonM
export class PersonM {
  constructor( id, fields ) { //name, listFactionM ) {
    console.log( "new PersonM fields=", fields );
    this.id = id;
    this.name = "person_name";
    this.listFactionM = [];

    // TODO could check validity
    for( const [key, value] of Object.entries( fields )) {
      if( key.localeCompare( 'name' ) == 0 ) {
        this.name = value;
      }
      if( key.localeCompare( 'listFactionM' ) == 0 ) {
        this.listFactionM = value;
      }
    }

    this.type = 'PersonM';
    this.viewF = null;
  }
  strDisplay() {
    let display = 'P['+this.id+']: '+this.name;
    return display;
  }
  toArchive() {
    var archive = {
      id: this.id,
      name: this.name,
      listFactionID: this.listFactionM.map( (item,index) => item.id ),
    };
    if (this.viewF) {
      archive['viewInfo'] = this.viewF.toArchive();
    }
    else {
      archive['viewInfo'] = null;
    }
    
    return archive;    
  }
  edit( fields ) {
     // TODO could check validity
    for( const [key, value] of Object.entries( fields )) {
      if( key.localeCompare( 'name' ) == 0 ) {
        this.name = value;
      }
      if( key.localeCompare( 'listFactionM' ) == 0 ) {
        this.listFactionM = value;
      }
    }
  }
}
// ***** to Manage Person.id
var _idmax_person = 0;
export function getIdMaxPerson() { return _idmax_person; }
export function makeNewPersonM( fields ) {
  return makeNewPersonIdM( _idmax_person, fields );
}
export function makeNewPersonIdM( id, fields ) {
  if (id < _idmax_person) {
    alert( "Cannot make new Person with improper id ("+id+")" );
    return;
  }
  var np = new PersonM( id, fields );
  _idmax_person = id+1;

  return np;
}
// *************************************************************** END - PersonM
