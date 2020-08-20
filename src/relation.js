import './general.css';

import ReactDOM from "react-dom";

import {getIdMaxFaction,
        makeNewFactionM,
        makeNewFactionIdM } from './models/factionM';
import {fabric} from 'fabric';
import {Vec,
        intersectRectVec,
        segmentPointVec,
        computeBezierPointVec} from './utils/vec';
import {allSetSelectable,addToAllSelectable,removeFromAllSelectable,
        allowPopup,setPopable} from './utils/select_pop';

import {addFactionF,  movedFactionF,
        editFactionF} from './views/factionF';

import {createContextMenuC} from './components/menuC.jsx';
import {createFactionC} from './components/factionC.jsx';

// *****************************************************************************
// ****************************************************************** body Event
// debug Event at body level -> look at target
var bodyElement = document.getElementsByTagName("BODY")[0];
/* bodyElement.addEventListener( 'contextmenu', function (event) {
 *   console.log( "BODY context", event );
 * }); */
// ESC : keydown (repeated) keyup
/* bodyElement.addEventListener( 'keydown', function (event) {
 *   console.log( "BODY keydown", event );
 * });
 * bodyElement.addEventListener( 'keypress', function (event) {
 *   console.log( "BODY keypress", event );
 * }); */
bodyElement.addEventListener( 'keyup', function (event) {
  //console.log( "BODY keyup", event );
  if (event.key === "Escape" ) {
    //console.log( "  ESC" );
    removeContextElementC();
    //TODO abortDrawArrow();
  }
});
// ************************************************************ END - body Event

// *****************************************************************************
// ********************************************************************** Canvas
var canvas = new fabric.Canvas( 'fabric_canvas', {
  width: 600,
  height: 600,
  fireRightClick: true,
  fireMiddleClick: true,
  stopContextMenu: true,
});
// **************************************************************** END - Canvas

// var f0 = makeNewFactionM( "Bob's Lovers" );
// console.log( "F0 GRAOU", f0 );
// var infoHeadE = document.getElementById( 'info_head' );
// infoHeadE.innerHTML = "again new " + f0.strDisplay();
// console.log( "F0 AGAIN", f0.strDisplay() );

// *****************************************************************************
// ***************************************************************** ListFaction
var _listFactionM = [];
function newFactionAction( fields, posV ) {
  console.log( "newFactionAction fields=",fields );
  var newM = makeNewFactionM( fields );
  var newF = addFactionF( canvas, newM, posV );
  _listFactionM.push( newM );
}
function addFactionActionA( factionA ) {
  console.log( "addFactionAction", factionA );
  if (factionA.id < 0) {
    alert( "Cannot addFaction with improper id ("+factionA.id+")" );
    return;
  }
  if (_listFactionM[factionA.id]) {
    alert( "Cannot addFaction over existing one (id="+factionA.id+")" );
    return;
  }

  let newM = makeNewFactionIdM( factionA.id, {name: factionA.name} );
  let posV = factionA.viewInfo.pos;
  var newF = addFactionF( canvas, newM, posV, [0,0,255] );
  _listFactionM.push( newM );
}
function editFactionActionL( id, fields ) {
  let factionM = _listFactionM[id];
  factionM.edit( fields );
  let view = factionM.viewF;
  editFactionF( view, factionM );
  _listFactionM[factionM.id] = factionM;
  canvas.renderAll();
}
// used as menu callback,  so (posV, idx)
function delFactionActionL( dummyV, factionIDX ) {
  console.log( "__delFaction", factionIDX );
  
  if (_listFactionM[factionIDX]) {
    let factionM = _listFactionM[factionIDX];
    if (factionM != null ) {
      // Remove all Relation to this faction
      _listRelationM.forEach( (item, index) => {
        if (item != null) {
          if (item.isRelated( factionM )) {
            delRelationActionL( item.id );
          }
        }
      });
      
      let itemF = _listFactionM[factionIDX].viewF;
      removeFromAllSelectable( itemF );
      canvas.remove( itemF );
      _listFactionM[factionIDX] = null;
    }
  }
  else {
    alert( "Cannot delFaction on non-existing faction" );
  }
}
function findFactionMwithName( name ) {
  return _listFactionM.find( (item,idx) => item.name == name );
}
// *********************************************************** END - ListFaction

var _listPersonM = [];
var _listRelationM = [];

// *****************************************************************************
// ********************************************************************* Actions
function askNewFactionM( posV, dummyObj ) {
  console.log( "askNewFactionM ", posV, dummyObj );
  const gotFieldsCbk = ( fields ) => {
    newFactionAction( fields, posV );
    removeContextElementC();
  }
  const cancelCbk = removeContextElementC;

  let factionC = createFactionC( { id:-1,
                                   name:'faction_name',
                                   color:{ r: 13, g: 71, b: 161, a: 1 }},
                                 gotFieldsCbk,
                                 cancelCbk );
  
  showContextElementC( posV, factionC );
}
function askEditFactionL( posV, factionIDX ) {
  console.log( "askEditFactionL factionIDX=", factionIDX );
  let factionM = _listFactionM[factionIDX];
  const gotFieldsCbk = ( fields ) => {
    editFactionActionL( factionM.id, fields );
    removeContextElementC();
  }
  const cancelCbk = () => {
    removeContextElementC();
  }

  let factionC = createFactionC( factionM,
                                 gotFieldsCbk,
                                 cancelCbk );
  showContextElementC( posV, factionC );
}

function archiveJSONAction() {
  // make new array with data to archive
  let archiveFaction = [];
  _listFactionM.forEach( (item, index) => {
    if (item) {
      archiveFaction.push( {factionA: item.toArchive()} );
    }
  });
  let archivePerson = [];
  _listPersonM.forEach( (item, index) => {
    if (item) {
      archivePerson.push( {personA: item.toArchive()} );
    }
  });
  let archiveRelation = [];
  _listRelationM.forEach( (item, index) => {
    if (item) {
      archiveRelation.push( {relationA: item.toArchive()} );
    }
  });

  let archive = {
    factions: archiveFaction,
    persons: archivePerson,
    relations: archiveRelation
  };
  let doc = JSON.stringify( archive );
  console.log( "__showAllAction in JSON" );
  console.log( doc );
  return doc;
}
// **************************************************************** END - Action


// *****************************************************************************
// **************************************************************** Context Menu
const handleDummy = ( obj, pos ) => {
  console.log( "DUMMY", obj, pos );
}
var _createContextMenu = [
  {label:"New Faction", cbk: askNewFactionM}, //( x, y, okCbk, cancelCbk )},
  {label:"New Person", cbk: handleDummy}, //askNewPersonM}   // ??
];
var _factionContextMenu = [
  {label:"Edit", cbk:askEditFactionL},
  {label:"New Relation", cbk: handleDummy}, //startRelationFromFactionL},
  {label:"<hr>",cbk:null}, // separator
  {label: "Delete", cbk: handleDummy}, //delFactionActionL} // TODO ask ?
];


var contextMenuE = document.getElementById( 'context_menu' );
// to prevent 'context menu for showing off
contextMenuE.addEventListener( 'contextmenu', function(event) {
  //console.log( "contextMenu contextmenu", event.buttons );
  event.preventDefault();
  event.stopPropagation();
},
                               true /* capture */
                             );

function displayContextMenu( flag ) {
  if (flag) {
    contextMenuE.style.display = "block";
    allSetSelectable( false );
  }
  else {
    contextMenuE.style.display = "none";
    allSetSelectable( true );
  }
  canvas.requestRenderAll();
}
var _contextPopupE;
function showContextElementC( posV, elemC ) {
  console.log( "showContextElementE", posV, elemC );
  setPopable( false );
  _contextPopupE = document.createElement( "DIV" );
  contextMenuE.appendChild( _contextPopupE );

  contextMenuE.style.left = posV.x + 'px';
  contextMenuE.style.top = posV.y + 'px';

  ReactDOM.render( elemC, _contextPopupE );
  displayContextMenu( true );
}

function removeContextElementC() {
  console.log( "removeContextElementE");
  _contextPopupE.remove();
  displayContextMenu( false );
  setPopable( true );
}
// ************************************************************ END Context Menu

// *****************************************************************************
// ************************************************************* Fabric Callback
// *****************************************************************************
canvas.on( 'mouse:down', function (opt) {
  console.log( 'canvas.mouse:down', opt, ); //_allowPopup );

   // RightClick
  if (opt.e.button === 2) {
    // on the background of canvas
    if (opt.target === null) {
      // if already popping then abort also
      if ( !allowPopup() ) {
        removeContextElementC();
      }
      else {
        //use mouseEvent to know absolute position
        let posV = new Vec(opt.e.x, opt.e.y);
        let creationMenuC = createContextMenuC( posV,
                                                null, // elemIDX
                                                "Creation Menu",
                                                _createContextMenu, // items
                                                removeContextElementC );
                                              
        showContextElementC( posV, creationMenuC );
      }
    }
    else {
      // a Faction
      if (opt.target.elemType === "Faction") {
        // while drawingArrow
        // if (isDrawArrow()) {
        //   console.log( "ED 2 display target" );
        //   endDrawArrow( opt.e.x, opt.e.y, opt.target );
        //   return
        // }
        // console.log( "RC: ",opt );
        // console.log( "  F:",_listFaction[opt.target.id] );
        if( allowPopup() ) {
          let posV = new Vec(opt.e.x, opt.e.y);
          let factionMenuC = createContextMenuC( posV,
                                                 opt.target.id, // elemIDX
                                                 "Faction Menu",
                                                 _factionContextMenu, // items
                                                 removeContextElementC );
          showContextElementC( posV, factionMenuC );
        }
      }
      else {
        console.log( "RClick on ", opt.target );
        alert( "RClick on what ?" );
      }
    }
  }
  
  // Middle click
  if (opt.e.button === 1) {
    alert( "X="+opt.e.x+", Y="+opt.e.y );
  }
});
// ******************************************************* End - Fabric Callback

// *****************************************************************************
// ********************************************************************* Buttons
var btnInfoE = document.getElementById( "btn_info" );
btnInfoE.addEventListener( 'click', () => {
  console.log( "_listFactionM size=",_listFactionM.length, getIdMaxFaction() );
  archiveJSONAction();
});
function btnSave() {
  saveAllJSONAction();
}
function btnLoad(event) {
  console.log( "__Load e=",event );
  readAllFromFileAction( event.target.files[0] );
}
// ***************************************************************** END Buttons
