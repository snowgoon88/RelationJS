// Fabric in canvas Element 'fabric_canvas'
var canvas = new fabric.Canvas( 'fabric_canvas', {
  width: '600',
  height: '600',
  fireRightClick: true,
  fireMiddleClick: true,
  stopContextMenu: true,
});

// First group with 2 circles
var c1 = new fabric.Circle( {
  radius: 20,
  fill: 'red',
  left: 0
});
var c2 = new fabric.Circle( {
  radius: 20,
  fill: 'blue',
  left: 40
});

var g1 = new fabric.Group( [c1,c2], {
  left: 100,
  top: 100
});

var c3 = new fabric.Circle( {
  radius: 20,
  fill: 'green',
  top: 50
});

var g2 = new fabric.Group( [g1,c3], {
  left: 200,
  top: 200
});

var r1 = new fabric.Rect( {
  left: 10,
  top: 10,
  width: 20,
  height: 20,
  fill: 'blue',
});
var r2 = new fabric.Rect( {
  left: 70,
  top: 70,
  width: 20,
  height: 20,
  fill: 'red',
});
canvas.add( r1, r2 );
canvas.add( g1 );
canvas.add( g2 );

function infoObj( msg, item ) {
  console.log( msg+'=', item );
  console.log( '    type=', item.type );
}

function getPos( item ) {
  let left = item.left;
  let top = item.top;
  // in group ??
  if (item.group) {
    let gPos = getPos( item.group );
    left += gPos.left + item.group.width/2;
    top += gPos.top + item.group.height/2;
  }
  return {left:left, top:top};
}
function btnBezier() {
  infoObj( "G2", g2 );
  infoObj( "G1", g1 );
  infoObj( "C1", c1 );
  infoObj( "C2", c2 );
  infoObj( "C3", c3 );
  console.log( "g2=", getPos(g2) )
  console.log( "c1=", getPos(c1) );
  console.log( "c2=", getPos(c2) );
  console.log( "c3=", getPos(c3) );
  console.log( "g1=", getPos(g1) );
}

function btnCtrl() {
  infoObj( "R1", r1 );
  console.log( "r1=", getPos(r1) );
  infoObj( "R2", r2 );
  console.log( "r2=", getPos(r2) );
}
canvas.on( 'mouse:down', (opt) => {
  if (opt.e.button === 2) {
    alert( "X="+opt.e.x+", Y="+opt.e.y );
  }
});
