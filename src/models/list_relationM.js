/*
import {getListRelationM, getRelationL, findRelationMWith,
        addToRelationM, delFromRelationL } from 'path/list_relation';
*/
// *****************************************************************************
// *************************************************************** ListRelationM
var _listRelationM = [];
export function getListRelationM() { return _listRelationM; }
export function getRelationL( relationIDX ) {
  return _listRelationM[relationIDX];
}
export function findRelationMWith( itemM ) {
  let result = [];
  for( let idx=0; idx < _listRelationM.length; idx++ ) {
    let relationM = _listRelationM[idx];
    if (relationM != null) {
      if (relationM.srcM === itemM || relationM.destM === itemM ) {
        result.push( relationM );
      }
    }
  }
  return result;
}
export function addToRelationM( relationM ) {
  if (relationM.id < 0) {
    alert( "Cannot addToRelation with improper id ("+relationM.id+")" );
    return;
  }
  if (_listRelationM[relationM.id]) {
    alert( "Cannot addToRelation over existing one (id="+relationM.id+")" );
    return;
  }
  _listRelationM.push( relationM );
}
export function delFromRelationL( relationIDX ) {
  console.log( "__delRelation", relationIDX );

  if (_listRelationM[relationIDX]) {
    let relationM = _listRelationM[relationIDX];
    relationM.viewF.remove();
    _listRelationM[relationIDX] = null;
  }
}
// ********************************************************* END - ListRelationM
