
/*
import {allSetSelectable,addToAllSelectable,removeFromAllSelectable,
        allowPopup,setPopable} from '../utils/select_pop';
*/
// *****************************************************************************
// **************************************************** Selectability/Popability
// to switch selected FabricObject between selectable/non-selectable
// TODO: need to be remove from the list
var _allSelectableF = [];
export function allSetSelectable( flag ) {
  _allSelectableF.map( (item,index) => {
    item.selectable = flag;
  });
}
export function addToAllSelectable( itemF ) {
  _allSelectableF.push( itemF );
}
export function removeFromAllSelectable( itemF ) {
  _allSelectableF = _allSelectableF.filter( (ele) => {
    ele != itemF;
  });
}
var _allowPopup = true;
export function allowPopup() {
  return _allowPopup;
}
export function setPopable( flag ) {
  console.log( "setPopable", flag );
  _allowPopup = flag;
}
// ********************************************** END - Selectability/Popability
