
/*
import { getPosF } from 'path/utils';
*/

// *****************************************************************************
// **************************************************************** Fabric utils
// Compute position of a FabricItem, even if nested in a group/selection.
// Requirement: group.originX: left, group.originY. top
//
// Returns {left, top, width, height}
export function getPosF( item ) {
  let left = item.left;
  let top = item.top;
  // in group ??
  if (item.group) {
    let gPos = getPosF( item.group );
    left += gPos.left + item.group.width/2;
    top += gPos.top + item.group.height/2;
  }
  return {left:left, top:top, width:item.width, height:item.height };
}
// ************************************************************ END Fabric Utils
