
/*
import {RelationM,  getIdMaxRelation,
        makeNewRelationM, makeNewRelationIdM} from 'path/relationM';
*/
// *****************************************************************************
// ******************************************************************* RelationM
// require: 
export class RelationM {
  constructor( id, fields ) {
    this.id = id;
    this.name = "relation_name";
    this.srcM = null;
    this.destM = null;

    // TODO could check validity
    for( const [key, value] of Object.entries( fields )) {
      if( key.localeCompare( 'name' ) == 0 ) {
        this.name = value;
      }
      if( key.localeCompare( 'srcFactionM' ) == 0 ) {
        this.srcM = value;
      }
      if( key.localeCompare( 'destFactionM' ) == 0 ) {
        this.destM = value;
      } 
    }
    
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
  edit( fields ) {
    // TODO could check validity
    for( const [key, value] of Object.entries( fields )) {
      if( key.localeCompare( 'name' ) == 0 ) {
        this.name = value;
      }
      if( key.localeCompare( 'srcFactionM' ) == 0 ) {
        this.srcM = value;
      }
      if( key.localeCompare( 'destFactionM' ) == 0 ) {
        this.destM = value;
      } 
    }
  }
  isRelated( factionM ) {
    return (this.srcM === factionM || this.destM === factionM);
  }
}
// ***** to Manage Faction.id
var _idmax_relation = 0;
export function getIdMaxRelation() { return _idmax_relation; }
export function makeNewRelationM( fields ) {
  return makeNewRelationIdM( _idmax_relation, fields );
}
export function makeNewRelationIdM( id, fields ) {
  console.log( "makeNewRelationIdM ", id, fields );

  if (id < _idmax_relation) {
    alert( "Cannot make new Relation with improper id ("+id+")" );
    return;
  }
  var nr = new RelationM( id, fields );
  _idmax_relation = id+1;

  return nr;
}
// ************************************************************* END - RelationM
