
/*
import {FactionM,  getIdMaxFaction,
        makeNewFactionM, makeNewFactionIdM} from 'path/factionM';
*/
// *****************************************************************************
// ******************************************************************** FactionM
export class FactionM {
  constructor( id, fields ) {
    this.id = id;
    this.name = "faction_name";
    this.color = { r:0, g:0, b:255 };

    // TODO could check validity
    for( const [key, value] of Object.entries( fields )) {
      if( key.localeCompare( 'name' ) == 0 ) {
        this.name = value;
      }
      if( key.localeCompare( 'color' ) == 0 ) {
        this.color = value;
      }
    }
    
    this.type = 'FactionM';
    this.viewF = null;      // FabricJS view
  }
  strDisplay() {
    let display = 'F['+this.id+']: '+this.name;
    return display;
  }
  toArchive() {
    var archive = {
      id: this.id,
      name: this.name,
      color: this.color,
    };
    if (this.viewF) {
      archive['viewInfo'] = { pos: {x:this.viewF.left, y:this.viewF.top }};
    }
    else {
      archive['viewInfo'] = null;
    }

    return archive;
  }
}
// ***** to Manage Faction.id
var _idmax_faction = 0;
export function getIdMaxFaction() { return _idmax_faction; }
export function makeNewFactionM( fields ) {
  return makeNewFactionIdM( _idmax_faction, fields );
}
export function makeNewFactionIdM( id, fields ) {
  if (id < _idmax_faction) {
    alert( "Cannot make new Faction with improper id ("+id+")" );
    return;
  }
  var nf = new FactionM( id, fields );
  _idmax_faction = id+1;

  return nf;
}
// ************************************************************** END - FactionM
