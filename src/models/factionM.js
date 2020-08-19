// *****************************************************************************
// ********************************************************************* Faction
// *****************************************************************************
export class FactionM {
  constructor( id, name ) {
    this.id = id;
    this.name = name;
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
export function makeNewFactionM( name ) {
  return makeNewFactionIdM( _idmax_faction, name );
}
export function makeNewFactionIdM( id, name ) {
  if (id < _idmax_faction) {
    alert( "Cannot make new Faction with improper id ("+id+")" );
    return;
  }
  var nf = new FactionM( id, name );
  _idmax_faction = id+1;

  return nf;
}
// *************************************************************** END - Faction
