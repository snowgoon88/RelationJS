
/*
import { getListPersonM, getPersonL,
         addToPersonM } from 'path/list_personM';
*/
// *****************************************************************************
// ***************************************************************** ListPersonM
var _listPersonM = [];
export function getListPersonM() { return _listPersonM; }
export function getPersonL( personIDX ) {
  return _listPersonM[personIDX];
}
export function addToPersonM( personM ) {
  if (personM.id < 0) {
    alert( "Cannot addToPerson with improper id ("+personM.id+")" );
    return;
  }
  if (_listPersonM[personM.id]) {
    alert( "Cannot addToPerson over existing one (id="+personM.id+")" );
    return;
  }
  _listPersonM.push( personM );
}
// *********************************************************** END - ListPersonM
