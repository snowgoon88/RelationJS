
// Fabric in canvas Element 'fabric_canvas'
var canvas = new fabric.Canvas( 'fabric_canvas', {
  width: '600',
  height: '600',
  fireRightClick: true,
  stopContextMenu: true,
});

// Create a Group with Circle and Text
// circle and text coordinates are given relative to Group
// acess objevt within group using 'items'
var ci = new fabric.Circle( {
  radius: 20,
  fill: 'red',
  //originX: 'center',
  //left: 100,
  originY: 'center',
  //top: 100,
});
var txt = new fabric.Text( 'A red Circle', {
  left: 45,
  //top: 100,
  //originX: 'center',
  originY: 'center',
  fontSize: 24,
  //fontWeight: 'bold',
  //underline: 'true',
  //fill: 'blue',
  //shadow: 'rgba(0,0,0,0.2), 5px 5px 0px',
  textAlign : 'left',
  textBackgroundColor: 'rgba(0,0,0, 0.2)'
});
var group = new fabric.Group( [ci,txt], {
  left: 200,
  top:200,
  originX: 'center',
  originY: 'center',
});
var lGV = new fabric.Line([200,0,200,canvas.getHeight()], {
  stroke: 'green',
  selectable: false,
});
var lGH = new fabric.Line([0,200,canvas.getWidth(),200], {
  stroke: 'green',
  selectable: false,
});

var lCV = new fabric.Line([100,0,100,canvas.getHeight()], {
  stroke: 'red',
  selectable: false,
});
var lCH = new fabric.Line([0,100,canvas.getWidth(),100], {
  stroke: 'red',
  selectable: false,
});

//canvas.add( ci, txt );
canvas.add( group, lGV, lGH );
canvas.add( lCH, lCV );

// ***********************************************************************
function getInfo() {
  console.log( "G=",group );
};
var popupElement = document.getElementById( 'fabric_menu' );
function displayPopup( flag ) {
  if (flag) {
    popupElement.style.display = "block";
  }
  else {
    popupElement.style.display = "none";
  } 
}
displayPopup( false );


function btnCtrl() {
  console.log( "TXT=", txt );
  let res = txt._calculateCurrentDimensions();
  console.log( "  txt._calculateCurrentDimensions();" );
  console.log( "  RES=", res );
  console.log( "NOW=", txt );

  console.log( "GRP=", group );
  res = group._calculateCurrentDimensions();
  console.log( "  RES=", res );
  group.setObjectsCoords();
  console.log( "  setObjectscoords");
  console.log( "GRP=", group );
  console.log( "  addWithUpdate()" );
  group.addWithUpdate(); // no arguments BINGO !!
  console.log( "GRP=", group );
}

function updateDims (objF) {
  let dims = objF._calcDimensions();
  objF.set({
    width: dims.width,
    height: dims.height,
    left: dims.left,
    top: dims.top,
    /* pathOffset: {
     *   x: dims.width / 2 + dims.left,
     *   y: dims.height / 2 + dims.top
     * }, */
    dirty: true
  });
  objF.setCoords();
}

function btnBezier() {
  // change pas les dimensions du groupe...
  //txt.set( {'text': "Et c'est changé"} );
  group.item(1).set( {'text': "Et c'est changé"} );
  group.addWithUpdate(); // recompute dimensions
  canvas.renderAll();
  //updateDims( group.item(1) );
  //updateDims( group );

  //Text::initDimensions()
  //Initialize or update text dimensions.

  //Group addWithUpdate(object) → {fabric.Group}
  //Adds an object to a group; Then recalculates group's dimension, position. 
  // => add with nothing ?

  //Group setObjectsCoords() → {fabric.Group}
  // Sets coordinates of all objects inside group 
}
