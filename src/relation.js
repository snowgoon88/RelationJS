import './general.css';

import ReactDOM from "react-dom";
import { saveAs } from 'file-saver';

import {fabric} from 'fabric';
import {Vec} from './utils/vec';
import {allSetSelectable,removeFromAllSelectable,
        allowPopup,setPopable} from './utils/select_pop';

import {getIdMaxFaction,
        makeNewFactionM,
        makeNewFactionIdM } from './models/factionM';
import {addFactionF,
        editFactionF} from './views/factionF';

import {getIdMaxPerson,
        makeNewPersonM, makeNewPersonIdM} from './models/personM';
import {PersonF} from './views/personF';

import {makeNewRelationM, makeNewRelationIdM} from './models/relationM';
import {RelationF} from './views/relationF';

import { getListPersonM, getPersonL,
         addToPersonM } from './models/list_personM';
import { getListRelationM, findRelationMWith, getRelationL,
         addToRelationM, setListRelationL, delFromRelationL }
from './models/list_relationM';

import {createContextMenuC} from './components/menuC.jsx';
import {createFactionC} from './components/factionC.jsx';
import {createRelationC} from './components/relationC.jsx';
import {createPersonC} from './components/personC.jsx';
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
// **************************************************************** ListFactionM
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

  let newM = makeNewFactionIdM( factionA.id, factionA );
  let posV = factionA.viewInfo.pos;
  var newF = addFactionF( canvas, newM, posV );
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
  
  if( _listFactionM[factionIDX] ) {
    let factionM = _listFactionM[factionIDX];
    if (factionM != null ) {
      // Remove all Relation to this faction
      getListRelationM().forEach( (item, index) => {
        if (item != null) {
          if (item.isRelated( factionM )) {
            delFromRelationL( item.id );
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
// ********************************************************** END - ListFactionM

//var _listPersonM = [];
// ***************************************************************** ListPersonM
// fields = {name, listFactionM} 
function newPersonAction( fields, posV ) {
  var npM = makeNewPersonM( fields );
  var npF = new PersonF( canvas, npM, posV );
  npM.viewF = npF;
  addToPersonM( npM );
}
// *********************************************************** END - ListPersonM



function newRelationAction( name, srcM, destM ) {
  // check different items
  if (srcM === destM) {
    alert( "No Relation with same Element" );
    return;
  }
  var nrM = makeNewRelationM( {name:name, srcFactionM:srcM,
                               destFactionM:destM} );
  var nrF = new RelationF( canvas, nrM, 'red' );
  nrM.viewF = nrF;
  addToRelationM( nrM );

  // deselect everything except new relation
  canvas.discardActiveObject();
  nrF.setActive();
}


function addRelationActionA( relationA ) {
  console.log( "addRelationActionA", relationA );
  // if (relationA.id < 0) {
  //   alert( "Cannot addRelation with improper id ("+relationA.id+")" );
  //   return;
  // }
  // if (_listRelationM[relationA.id]) {
  //   alert( "Cannot addRerlation over existing one (id="+relationA.id+")" );
  //   return;
  // }
  let srcFactionM = _listFactionM[relationA.srcId];
  let destFactionM = _listFactionM[relationA.destId];

  var nrM = makeNewRelationIdM( relationA.id,
                                {name: relationA.name,
                                 srcFactionM: srcFactionM,
                                 destFactionM: destFactionM} );
  var nrF = new RelationF( canvas, nrM, 'red' );
  nrM.viewF = nrF;
  nrF.setCtrlPt( relationA.viewInfo.posCtrl );
  nrF.setInactive();
  addToRelationM( nrM );
}

function editRelationActionL( id, fields ) {
  let relationM = getRelationL( id );
  relationM.edit( fields );
  let view = relationM.viewF;
  view.edit( relationM );
  setListRelationL( id, relationM );
  canvas.renderAll();
}

// function delRelationActionL( relationIDX ) {
//   console.log( "__delRelation", relationIDX );

//   if( getRelationL( relationIDX ) {
//     let relationM = getRelationL( relationIDX );
//     relationM.viewF.remove();
//     _listRelationM[relationIDX] = null;
//   }
// }

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

const askNewPersonM = ( posV, dummyObj ) => {
  console.log( "askNewPersonM ", posV, dummyObj );
  
  const gotFieldsCbk = (fields) => {
    let listFactionM = fields.factions.map( (item,idx) =>
                                            findFactionMwithName(item) );
    newPersonAction( {name: fields.name,
                      listFactionM: listFactionM},
                     posV );
    removeContextElementC();
  }

  const cancelCbk = removeContextElementC;

  let factionsName = _listFactionM.map( (item,idx) => item.name );
  let personC = createPersonC( { id: -1,
                                 name: 'person_name'},
                               factionsName,
                               gotFieldsCbk,
                               cancelCbk );
  showContextElementC( posV, personC );
}

function askNewRelationM( posV, dummyObj, okCbk, cancelCbk ) {
  console.log( "askNewRelationM ", posV, dummyObj );
  // ask for a fields
  const gotFieldsCbk = ( fields ) => {
    removeContextElementC();
    okCbk( fields );
  }
  const cancelFieldsCbk = () => {
    removeContextElementC();
    cancelCbk()
  }

  let relationC = createRelationC( {id:-1, name:"relation_name"},
                                   gotFieldsCbk,
                                   cancelFieldsCbk );
  showContextElementC( posV, relationC );
}
function askEditRelationL( posV, relationIDX ) {
  let relationM = getRelationL( relationIDX );
  const gotFieldsCbk = ( fields ) => {
    editRelationActionL( relationM.id, fields );
    removeContextElementC();
  }
  const cancelFieldsCbk = () => {
    removeContextElementC();
  }
  let relationC = createRelationC( relationM,
                                   gotFieldsCbk,
                                   cancelFieldsCbk );
  showContextElementC( posV, relationC );
}
function askDelRelationL( posV, relationIDX ) {
  // TODO ask for confirmation ?
  delFromRelationL( relationIDX );
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
  getListPersonM().forEach( (item, index) => {
    if (item) {
      archivePerson.push( {personA: item.toArchive()} );
    }
  });
  let archiveRelation = [];
  getListRelationM().forEach( (item, index) => {
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
function saveAllJSONAction() {
  let doc = archiveJSONAction();
  let jsonBlob = new Blob([doc],
                          { type: 'application/javascript;charset=utf-8' });
  saveAs( jsonBlob, "faction_data.json" );
}
function populateAllFromJSONAction( doc ) {
  let archive = JSON.parse( doc );

  let archiveFaction = archive.factions;
  if( archiveFaction ) {
    archiveFaction.forEach( (item, index) => {
      console.log( "["+index+"]=",item );
      if (item.factionA.viewInfo) {
        console.log( "populate with", item.factionA );
        addFactionActionA( item.factionA );//DEL, item.factionA.viewInfo.pos );
        console.log( "_listFactionM size=",_listFactionM.length, getIdMaxFaction() );
      }
      else {
        alert( "Populate Faction from factionA without viewInfo" );
        return;
      }
    });
}
  let archivePerson = archive.persons;
  if( archivePerson ) {
    archivePerson.forEach( (item, index) => {
      console.log( "["+index+"]=",item );
      if (item.personA.viewInfo) {
        addPersonActionA( item.personA );
      }
      else {
        alert( "Populate Faction from factionA without viewInfo" );
        return;
      }
    });
  }
  
  let archiveRelation = archive.relations;
  archiveRelation.forEach( (item, index) => {
    console.log( "["+index+"]=",item );
    if (item.relationA.viewInfo) {
      addRelationActionA( item.relationA );
    }
    else {
      alert( "Populate Faction from factionA without viewInfo" );
      return;
    }
  });
}
function readAllFromFileAction( file ) {
  // Check right type (application/json)
  if (file.type && file.type.indexOf( 'application/json' ) === -1) {
    alert( "File "+file.name+" is not JSON file" );
    return;
  }

  const reader = new FileReader();
  reader.addEventListener( 'load', (event) => {
    console.log( "__READ loaded" );
    console.log( reader.result );
    populateAllFromJSONAction( reader.result );
  });
  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`__READ Progress: ${Math.round(percent)}`);
    }
  });
  reader.readAsText(file); // when finished, will throw 'load'
}

// used as a Menu Callback, so (posV, obj )
function startRelationFromFactionL( posV, factionIDX ) {
  console.log( 'startRelationFromFactionL', posV );
  // need to find FactionF related to this factionM
  let factionF = _listFactionM[factionIDX].viewF;
  startDrawArrow( factionF, posV );
}

// **************************************************************** END - Action

// *****************************************************************************
// ******************************************************************* DrawArrow
// *****************************************************************************
var _stateDA = "none"; // none | drawing
var _srcFDA = null;
var _lineDA;
function startDrawArrow( srcF, mouseV ) {
  _stateDA = "drawing";
  _srcFDA = srcF;
  // Create a new line from srcF.left/top to mouseP.x/y
  _lineDA = new fabric.Line( [srcF.left, srcF.top, mouseV.x, mouseV.y ], {
    stroke: 'red',
    selectable: false,
  });
  canvas.add( _lineDA );
  // cannot select anything
  allSetSelectable( false );
}
function updateDrawArrow( mouseV ) {
  // Update line to mouseP.x/y
  _lineDA.set( {'x2': mouseV.x, 'y2': mouseV.y} );
  //_lineDA.setCoords();
  //_lineDA.set('dirty', true);
  canvas.requestRenderAll();
}
function abortDrawArrow() {
  console.log( "abortDA" );
  _stateDA = "none";
  _srcFDA = null;
  canvas.remove( _lineDA );
  allSetSelectable( true );
}
function endDrawArrow( x, y, itemF ) {
  console.log( "endDA", itemF );
  // check it is a Faction
  if (itemF.model && itemF.model.type === "FactionM" ) {
    _stateDA = "none";

    // ask for a Relation fields
    const gotFields = (fields) => {
      console.log( "endARROW => newRelation", fields.name );
      canvas.remove( _lineDA );
      newRelationAction( fields.name, _srcFDA.model, itemF.model );

      //DEL removeContextElementC();
      allSetSelectable( true );
    }
    const cancelFields = () => {
      console.log( "endARROW => abort" );

      abortDrawArrow();
      removeContextElementC();
    }
    askNewRelationM( new Vec(x, y), null, gotFields, cancelFields );
  }
  else {
    return abortDrawArrow();
  }
}
function isDrawArrow() {
  return _stateDA === "drawing";
}
// *************************************************************** END DrawArrow


// *****************************************************************************
// **************************************************************** Context Menu
const handleDummy = ( obj, pos ) => {
  console.log( "DUMMY", obj, pos );
}
var _createContextMenu = [
  {label:"New Faction", cbk: askNewFactionM}, //( x, y, okCbk, cancelCbk )},
  {label:"New Person", cbk: askNewPersonM}   // ??
];
var _factionContextMenu = [
  {label:"Edit", cbk: askEditFactionL},
  {label:"New Relation", cbk: startRelationFromFactionL},
  {label:"<hr>",cbk:null}, // separator
  {label: "Delete", cbk: delFactionActionL} // TODO ask ?
];
var _relationContextMenu = [
  {label:"Edit", cbk: askEditRelationL},
  {label:"<hr>",cbk:null}, // separator
  {label: "Delete", cbk: askDelRelationL}
]

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

  // Left click
  if( opt.e.button === 0 ) {
    if( opt.target === null ) {
      // while drawingArrow
      if( isDrawArrow() ) {
        console.log( "ED 1 display null" );
        abortDrawArrow();
        return;
      }
    }
    else {
      // while drawingArrow
      if( isDrawArrow() ) {
        console.log( "ED 1 display target" );
        endDrawArrow( opt.e.x, opt.e.y, opt.target );
        return
      }
    }
  }
   // RightClick
  if( opt.e.button === 2 ) {
    // on the background of canvas
    if( opt.target === null ) {
      // while drawingArrow
      if( isDrawArrow() ) {
        console.log( "ED 2 display null" );
        abortDrawArrow();
        return;
      }
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
      if( opt.target.elemType === "Faction" ) {
        // while drawingArrow
        if( isDrawArrow() ) {
          console.log( "ED 2 display target" );
          endDrawArrow( opt.e.x, opt.e.y, opt.target );
          return
        }
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
      else if( opt.target.elemType === "Relation" ) {
        // while drawingArrow
        if( isDrawArrow() ) {
          abortDrawArrow();
          return
        }

        // ContextMenu for Relation
        if( allowPopup() ) {
          let posV = new Vec(opt.e.x, opt.e.y);
          let relationMenuC = createContextMenuC( posV,
                                                  opt.target.id, // elemIDX
                                                  "Relation Menu",
                                                  _relationContextMenu, // items
                                                  removeContextElementC );
          showContextElementC( posV, relationMenuC );
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

canvas.on( 'mouse:move', function (opt) {
  //console.log( 'M', opt );
  if( isDrawArrow() ) {
    console.log( "M udateDrawArrow", opt.absolutePointer );
    updateDrawArrow( opt.absolutePointer);
  }
});

canvas.on( 'object:moved', (opt) => {
  // opt.target is an ActiveSelection or a 'rawObject'
  console.log( 'object:moved', opt );
  //console.log( '  moved ', opt.target.type );
  //console.log( '  moved ', typeof(opt.target) );

  if( opt.target.type === "activeSelection" ) {
    console.log( '  moving activeSelection', opt.target );
    opt.target.forEachObject( (itemF, idx) => {
      if( itemF.model.type === "FactionM" ) {
        movedFactionF( itemF );
      }
    });
  }
  else if( opt.target.model && opt.target.model.type === "FactionM" ) {
    movedFactionF( opt.target );
  }
});

function movedFactionF( itemF ) {
  console.log( 'movedFactionF ', itemF.model.name );
  let allRelationM = findRelationMWith( itemF.model );
  allRelationM.forEach( (itemM,idx) => itemM.viewF.updateEnds() );
}
// ******************************************************* End - Fabric Callback

// *****************************************************************************
// ********************************************************************* Buttons
var btnInfoE = document.getElementById( "btn_info" );
btnInfoE.addEventListener( 'click', () => {
  console.log( "_listFactionM size=",_listFactionM.length, getIdMaxFaction() );
  archiveJSONAction();
});

var btnSave = document.getElementById( "btn_save" );
btnSave.addEventListener( 'click', () => {
  saveAllJSONAction();
});

var inputLoad = document.getElementById( "file-selector" ); 
inputLoad.addEventListener( 'change', () => {
  console.log( "__Load e=",event );
  readAllFromFileAction( event.target.files[0] );
});
// ***************************************************************** END Buttons
