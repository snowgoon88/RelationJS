// Request: object_freact.js


// Fabric in canvas Element 'fabric_canvas'
var canvas = new fabric.Canvas( 'fabric_canvas', {
  width: '600',
  height: '600',
  fireRightClick: true,
  stopContextMenu: true,
});
//canvas.setDimensions( {width: '100%'}, {cssOnly: true} );

// create a rectangle
var rectRed = new fabric.Rect({
  originX: 'center',
  left: 100,
  originY: 'center',
  top: 100,
  stroke: 'black',
  fill: 'rgba(255, 0, 0, 0.3)',
  width: 50,
  height: 50,
  angle: 0
});
console.log( '__BEFORE add' );
getInfo( rectRed );
function setObjectC ( obj ) {
  console.log( 'setObjectC' );
}
function setObjectFunction( cbk ) {
  setObjectC = cbk;
}

var lineRedV = new fabric.Line([100,0,100,canvas.getHeight()], {
  stroke: 'red',
  selectable: false,
});
var lineRedH = new fabric.Line([0,100,canvas.getWidth(),100], {
  stroke: 'red',
  selectable: false,
});

var circleGreen = new fabric.Circle({
  originX: 'center',
  left: 200,
  originY: 'center',
  top: 350,
  radius: 75,
  stroke: 'black',
  fill: 'rgba(0, 255, 0, 0.3)',
});

var lineGreenV = new fabric.Line([100,0,100,canvas.getHeight()], {
  stroke: 'green',
  selectable: false,
});
var lineGreenH = new fabric.Line([0,100,canvas.getWidth(),100], {
  stroke: 'green',
  selectable: false,
});

var lineArrow = new fabric.Line( [100,100,200,350], {
  stroke: 'blue',
  strokeWidth: 2,
  selectable: false,
  perPixelTargetFind: true,
});

var cR = new fabric.Circle({
  originX: 'center',
  left: 0,
  originY: 'center',
  top: 0,
  radius: 10,
  stroke: 'black',
  fill: 'rgba(0,0,0,0)'
});

var cG = new fabric.Circle({
  originX: 'center',
  left: 0,
  originY: 'center',
  top: 0,
  radius: 10,
  stroke: 'black',
  fill: 'rgba(0,0,0,0)'
});

// Coord of "top extremity"
var tri = new fabric.Triangle({
  originX: 'center',
  left: 200,
  //originY: 'center',
  top: 350,
  width: 30,
  height: 45,
  stroke: 'black',
  fill: 'rgba(0, 0, 255, 0.3)',
});
var lineBlueV = new fabric.Line([200,0,200,canvas.getHeight()], {
  stroke: 'blue',
  selectable: false,
});
var lineBlueH = new fabric.Line([0,350,canvas.getWidth(),350], {
  stroke: 'blue',
  selectable: false,
});

canvas.add( rectRed );
console.log( '__AFTER add' );
getInfo( rectRed );
canvas.add( lineRedH );
canvas.add( lineRedV );
canvas.add( circleGreen );
canvas.add( lineGreenH );
canvas.add( lineGreenV );

canvas.add( tri, lineBlueV, lineBlueH );

canvas.add( lineArrow );
canvas.add( cR );
canvas.add( cG );
updateArrow( rectRed, circleGreen );

// *****************************************************************************
// ************************************************************************ Path
var quadPath = new fabric.Path('M100,100 Q120,250 200,350', {
  stroke: 'black',
  fill: false,
  selectable: true,
  perPixelTargetFind: true,
  hasControls: false,
  hasRotatingPoint: false,
  lockRotation: true,
  lockMovementX: true,
  lockMovementY: true,
  lockScalingX: true,
  lockScalingY: true,
  lockSkewingX: true,
  lockSkewingY: true,
  srcOld: {left: 100, top: 100},
  destOld: {left: 200, top: 350},
  ctrlOld: {left: 120, top: 250},
});
var cQ = new fabric.Circle({
  originX: 'center',
  left: 120,
  originY: 'center',
  top: 250,
  radius: 10,
  stroke: 'black',
  fill: 'rgba(0,0,0,1)',
  selectable: true,
  hasControls: false,
  hasRotatingPoint: false,
  lockRotation: true,
  lockMovementX: false,
  lockMovementY: false,
  lockScalingX: true,
  lockScalingY: true,
  lockSkewingX: true,
  lockSkewingY: true,
});
var triQ = new fabric.Triangle({
  originX: 'center',
  left: 10,
  //originY: 'center',
  top: 10,
  width: 30,
  height: 45,
  stroke: 'black',
  fill: 'rgba(0, 0, 0, 0.3)',
});
canvas.add( quadPath );
canvas.add( cQ );
canvas.add( triQ );
function toPathArray( start, end, control ) {
  var path = [];
  path.push( ["M", start.x, start.y] );
  path.push( ["Q", control.x, control.y, end.x, end.y] );
  return path;
}
function normVec( vec ) {
  return Math.sqrt( vec.left*vec.left + vec.top*vec.top );
}
function dotVec( v1, v2 ) {
  return (v1.left*v2.left + v1.top*v2.top);
}
function scalarVec( k, vec ) {
  return {left: k*vec.left, top: k*vec.top};
}
function diffVec( v1, v2) {
  return {left: v1.left - v2.left, top: v1.top - v2.left};
}
function perpVec( vec ) {
  return {left: -vec.top, top:vec.left};
}
function showVec( msg, vec ) {
  console.log( msg+'=( '+vec.left.toString()+', '+vec.top.toString()+')' );
};
function updateBezier( src, dest, ctrl) {
  if (ctrl) {
    console.log( "UpdateB with CTRL" );
  }
  else {
    // update CTRL proportionnaly
    /* var oldPath = quadPath.get( 'path' );
     * let srcOld = {left: oldPath[0][1], top:oldPath[0][2]};
     * let destOld = {left: oldPath[1][3], top:oldPath[1][4]};
     * let ctrlOld = {left: oldPath[1][1], top:oldPath[1][2]}; */

    let srcOld = quadPath.get( 'srcOld' );
    let destOld = quadPath.get( 'destOld');
    let ctrlOld = quadPath.get( 'ctrlOld');
    
    let srcCtrlOld = {left: ctrlOld.left - srcOld.left,
                      top: ctrlOld.top - srcOld.top};
    showVec( 'scO', srcCtrlOld );
    let srcDestOld = {left: destOld.left - srcOld.left,
                      top: destOld.top - srcOld.top};
    let normOld = normVec( srcDestOld );
    showVec( 'sdO ', srcDestOld );
    let srcDest = {left: dest.left - src.left,
                   top: dest.top - src.top};
    showVec( 'sd ', srcDest );

    // Old projection on local frame
    let ctrlXRatio = dotVec( srcCtrlOld, srcDestOld ) / (normOld * normOld);
    console.log( 'xRatio='+ctrlXRatio.toString() );
    let ctrlYRatio = dotVec( srcCtrlOld, perpVec( srcDestOld )) / (normOld * normOld);
    console.log( 'yRatio='+ctrlYRatio.toString() );
    // Actual projection
    let updCtrlX = scalarVec( ctrlXRatio, srcDest );
    showVec( 'cxU ', updCtrlX );
    let updCtrlY = scalarVec( ctrlYRatio, perpVec( srcDest ));
    showVec( 'cyU ', updCtrlY );
    
    ctrl = {left:src.left + updCtrlX.left + updCtrlY.left,
            top:src.top + updCtrlX.top + updCtrlY.top };
    showVec( 'ctrl ', ctrl );

    // update ControlPoint
    cQ.set( {'left': ctrl.left, 'top': ctrl.top} );
    cQ.setCoords();
  }
  // Update start and end points
  // Intersection BBox with lines src->ctrl and dest->ctrl
  // compute angle
  let xSrc,ySrc,xDest,yDest;
  xSrc = src.left; ySrc = src.top;
  xDest = cQ.left; yDest = cQ.top;
  let coordR = intersectRect( rectRed, xDest-xSrc, yDest-ySrc );

  xSrc = cQ.left; ySrc = cQ.top;
  xDest = dest.left; yDest = dest.top;
  let angle = Math.atan2( yDest-ySrc, xDest-xSrc );
  let coordG = intersectCircle( circleGreen, angle - Math.PI );
  
  // angle for arrow
  angle += Math.PI / 2.0;
  angle = angle * 180.0 / Math.PI;
  //console.log('UA angle=',angle);
  triQ.set( {'left': coordG.x, 'top': coordG.y, 'angle': angle} );

  //var path = 
  var path = toPathArray( coordR, coordG,
                          {x: ctrl.left, y:ctrl.top}
  );
  quadPath.set( {
    'path' : path,
    'srcOld': src,
    'destOld': dest,
    'ctrlOld': ctrl,
  });
  //cQ.set( {'left':120, 'top':250} );
  // https://stackoverflow.com/questions/29011717/update-fabric-js-path-points-dynamically
  var dims = quadPath._calcDimensions()
  quadPath.set({
    width: dims.width,
    height: dims.height,
    left: dims.left,
    top: dims.top,
    pathOffset: {
      x: dims.width / 2 + dims.left,
      y: dims.height / 2 + dims.top
    },
    dirty: true
  })
  quadPath.setCoords()
}
function btnBezier() {
  var path = quadPath.get( 'path' );
  console.log( "QUAD", quadPath );
}
function btnCtrl() {
  console.log( "cQ", cQ );
}
// *****************************************************************************
// ************************************************************************ Text
var tHello = new fabric.Text( 'Hello World!', {
  left: 10,
  top: 10,
  //fontSize: 20,
  fontWeight: 'bold',
  underline: 'true',
  //fill: 'blue',
  //shadow: 'rgba(0,0,0,0.2), 5px 5px 0px',
  textAlign : 'left',
  textBackgroundColor: 'rgba(0,0,255, 0.2)'
});
canvas.add( tHello );
//console.log( 'fontsize=',tHello.get( 'fontSize' ));

var iEditable = new fabric.IText( 'à changer ?', {
  left: 10,
  top: 50,
  fontSize: 20,
  textAlign: 'left'
});
canvas.add( iEditable );

var halfC1 = new fabric.Circle({
  originX: 'center',
  left: 400,
  originY: 'center',
  top: 150,
  radius: 30,
  stroke: 'black',
  fill: 'rgba(0, 255, 0, 0.3)',
  startAngle: 0,
  endAngle: Math.PI/2.0
});
canvas.add( halfC1 );

// *****************************************************************************
function getInfo( obj ) {
  console.log( obj );
}

function updateArrow( src, dest) {
  var xSrc = src.left;
  var ySrc = src.top;

  var xDest = dest.left;
  var yDest = dest.top;
  
  lineArrow.set( {'x1': rectRed.left, 'y1': rectRed.top} );
  lineArrow.set( {'x2': circleGreen.left, 'y2': circleGreen.top} );

  // compute angle
  var angle = Math.atan2( yDest-ySrc, xDest-xSrc );
  var coordR = intersectRect( rectRed, xDest-xSrc, yDest-ySrc ); 
  cR.set( {'left': coordR.x, 'top': coordR.y } );
  var coordG = intersectCircle( circleGreen, angle - Math.PI );
  cG.set( {'left': coordG.x, 'top': coordG.y } );

  // angle for arrow
  angle += Math.PI / 2.0;
  angle = angle * 180.0 / Math.PI;
  console.log('UA angle=',angle);
  tri.set( {'left': coordG.x, 'top': coordG.y, 'angle': angle} );
}

// Positive angle towards bottom
// Suppose Rect is itself with 0 angle rotation
function intersectRect( rect, vx, vy ) {
  var dx, dy;

  if (Math.abs( vy ) < Number.EPSILON) {
    if (vx > 0) {
      return {x:rect.aCoords.br.x, y:rect.top};
    }
    else {
      return {x:rect.aCoords.bl.x, y:rect.top};
    }
  }

  // right quadrant
  if (vx > Number.EPSILON) {
    dx = (rect.aCoords.br.x - rect.left);
    dy = (dx / vx) * vy;
    // right "down" quadrant
    if (dy > (rect.aCoords.br.y - rect.top)) {
      dy = (rect.aCoords.br.y - rect.top);
      dx = (dy / vy) * vx;
    }
    // right "up" quadrant
    else if (dy < (rect.aCoords.tr.y - rect.top)) {
      dy = (rect.aCoords.tr.y - rect.top);
      dx = (dy / vy) * vx;
    }
  }
  // left quadrant
  else if (vx < -Number.EPSILON) {
    dx = (rect.aCoords.bl.x - rect.left);
    dy = (dx / vx) * vy;
    // left "down" quadrant
    if (dy > (rect.aCoords.br.y - rect.top)) {
      dy = (rect.aCoords.br.y - rect.top);
      dx = (dy / vy) * vx;
    }
    // left "up" quadrant
    else if (dy < (rect.aCoords.tr.y - rect.top)) {
      dy = (rect.aCoords.tr.y - rect.top);
      dx = (dy / vy) * vx;
    }
  }
  // vx is null
  else {
    if (vy > 0) {
      return {x:rect.left, y:rect.aCoords.br.y};
    }
    else {
      return {x:rect.left, y:rect.aCoords.tr.y};
    }
  }
  
  return {x: rect.left+dx, y:rect.top+dy};
}

function intersectCircle( circle, angle) {
  var dx = circle.radius * Math.cos( angle );
  var dy = circle.radius * Math.sin( angle );
  return {x: circle.left+dx, y:circle.top+dy};
}

// order is moving, moved, modified
rectRed.on( 'modified', function() {
  console.log( 'RED modified' );
  setObjectC( rectRed );
  lineRedH.set( {'y1': rectRed.top, 'y2': rectRed.top} );
  lineRedV.set( {'x1': rectRed.left, 'x2': rectRed.left} );
  updateArrow( rectRed, circleGreen );
  updateBezier( rectRed, circleGreen );
});
circleGreen.on( 'modified', function() {
  console.log( 'GREEN modified' );
  lineGreenH.set( {'y1': circleGreen.top, 'y2': circleGreen.top} );
  lineGreenV.set( {'x1': circleGreen.left, 'x2': circleGreen.left} );
  updateArrow( rectRed, circleGreen );
  updateBezier( rectRed, circleGreen );
});
tri.on( 'modified', function() {
  lineBlueH.set( {'y1': tri.top, 'y2': tri.top} );
  lineBlueV.set( {'x1': tri.left, 'x2': tri.left} );
});
cQ.on( 'modified', function() {
  console.log( 'cQ modified' );
  updateBezier( rectRed, circleGreen, cQ );
});
quadPath.on( 'selected', function() {
  canvas.setActiveObject( cQ );
});
// *****************************************************************************
// *****************************************************************************
// test right click
var popupElement = document.getElementById( 'fabric_menu' );
function askNewFaction( x, y ) {
  console.log( 'askN',x,y );
  popupElement.style.left = x + 'px';
  popupElement.style.top = y + 'px';
  ReactDOM.render(
  <FObjectC
    object={rectRed}
    setObjectHandle={setObjectFunction}
    />,
  document.getElementById( 'fabric_menu' )
);
}
canvas.on( 'mouse:down', function (opt) {
  console.log( 'E',opt );
  if (opt.button === 1 && opt.target === null) {
    //use mouseEvent to know absolute position
    askNewFaction( opt.e.x, opt.e.y );
  }
});

/* rectRed.on( 'moving', function() {
 *   console.log( 'RED moving' );
 * });
 * 
 * rectRed.on( 'moved', function() {
 *   console.log( 'RED moved' );
 * });
 *  */
const rectRedElem = <FObjectC
object={rectRed}
setObjectHandle={setObjectFunction}
/>;

ReactDOM.render(
  rectRedElem,
  document.getElementById( 'react_red' )
);
