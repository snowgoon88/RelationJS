// *****************************************************************************
// ******************************************************************* Vec {x,y}
// *****************************************************************************
export class Vec {
  constructor( x, y ) {
    this.x = x;
    this.y = y;
  }
  norm() {
    return Math.sqrt( this.x * this.x + this.y * this.y );
  }
  minus( v ) {
    return new Vec( this.x - v.x, this.y - v.y );
  }
  dot( v ) {
    return this.x * v.x + this.y * v.y;
  }
  perp() {
    return new Vec( -this.y, this.x );
  }
  scalar( k ) {
    return new Vec( k * this.x, k * this.y );
  }
}
// Hyp : itemF is centered on {left,top}, itemF has width, height
//     : top is bigger when going down
export function intersectRectVec( itemF, vec ) {
  let dx, dy;
  let maxX = itemF.left + itemF.width/2;
  let minX = itemF.left - itemF.width/2;
  let maxY = itemF.top + itemF.height/2;
  let minY = itemF.top - itemF.height/2;

  if (Math.abs( vec.y ) < Number.EPSILON) {
    if (vec.x > 0) {
      return new Vec( maxX, itemF.top );
    }
    else {
      return new Vec( minX, itemF.top );
    }
  }

  // right quadrant
  if (vec.x > Number.EPSILON) {
    dx = (maxX - itemF.left);
    dy = (dx / vec.x) * vec.y;
    // right "down" quadrant
    if (dy > (maxY - itemF.top)) {
      dy = (maxY - itemF.top);
      dx = (dy / vec.y) * vec.x;
    }
    // right "up" quadrant
    else if (dy < (minY - itemF.top)) {
      dy = (minY - itemF.top);
      dx = (dy / vec.y) * vec.x;
    }
  }
  // left quadrant
  else if (vec.x < -Number.EPSILON) {
    dx = (minX - itemF.left);
    dy = (dx / vec.x) * vec.y;
    // left "down" quadrant
    if (dy > (maxY - itemF.top)) {
      dy = (maxY - itemF.top);
      dx = (dy / vec.y) * vec.x;
    }
    // left "up" quadrant
    else if (dy < (minY - itemF.top)) {
      dy = (minY - itemF.top);
      dx = (dy / vec.y) * vec.x;
    }
  }
  // vec.x is null
  else {
    if (vec.y > 0) {
      return new Vec( itemF.left, maxY );
    }
    else {
      return new Vec( itemF.left, minY );
    }
  }
  
  return new Vec( itemF.left+dx, itemF.top+dy );
}
// Compute the position of a point at absice 'abs' on segment [src,dest]
export function segmentPointVec( srcV, destV, abs ) {
  let x = srcV.x + abs * (destV.x - srcV.x);
  let y = srcV.y + abs * (destV.y - srcV.y);
  return new Vec(x,y);
}
// Compute a bezier point with absice 'abs'
export function computeBezierPointVec( srcV, destV, ctrlV, abs ) {
  let pt1 = segmentPointVec( srcV, ctrlV, abs );
  let pt2 = segmentPointVec( ctrlV, destV, abs );
  return segmentPointVec( pt1, pt2, abs );
}
// ******************************************************************* END - Vec
