// *****************************************************************************
// ************************************************************************ Event
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
  //console.log( "BODY keydown", event );
  if (event.key === "Escape" ) {
    //console.log( "  ESC" );
    displayPopup( false );
    removeContextMenuC();
    abortDrawArrow();
  }
});


// Fabric in canvas Element 'fabric_canvas'
var canvas = new fabric.Canvas( 'fabric_canvas', {
  width: 600,
  height: 600,
  fireRightClick: true,
  fireMiddleClick: true,
  stopContextMenu: true,
});


// *****************************************************************************
// ********************************************************************* Faction
// *****************************************************************************
class FactionM {
  constructor( id, name ) {
    this.id = id;
    this.name = name;
  }
  strDisplay() {
    let display = 'F['+this.id+']: '+this.name;
    return display;
  }
}
// ***** to Manage Faction.id
var _idmax_faction = 0;
function makeNewFactionM( name ) {
  var nf = new FactionM( _idmax_faction, name );
  _idmax_faction += 1;

  return nf;
}

// ***** to Change the Faction displayed/edited in FactionC
var setFactionHandle;
function setFactionFunctor (cbk) {
  setFactionHandle=cbk;
}
// *************************************************************** END - Faction

// *****************************************************************************
// ******************************************************************** FactionF
// *****************************************************************************
// require: fabric.js
// IText has NO border (the border is only when selected)
var _colHiglightRGBA = "rgba( 255, 0, 0, 0.2)";
function addFactionF( factionM, pos, colorRGB ) {
  let colRGBA = 'rgba( '+colorRGB[0]+', '+colorRGB[1]+', '+colorRGB[2]+', 0.2)';
  var labelF = new fabric.IText( 'F'+factionM.id+': '+factionM.name, {
    id: factionM.id,
    type: 'FactionF',
    originX: 'center',
    originY: 'center',
    left: pos.x,
    top: pos.y,
    fontSize: 20,
    fontWeight: 'bold',
    underline: 'true',
    textBackgroundColor: colRGBA,
    copyTextBackgroundColor: colRGBA,
    highlightBackgroundColor: _colHiglightRGBA,
    hasRotatingPoint: false,
    lockRotation: true,
    lockScalingX: true,
    lockSclaingY: true,
    lockSkewingX: true,
    lockSkewingY: true,
    padding: 10,
    // IText
    editable: false,
  });
  labelF.on( 'mouseover', function (opt) {
    console.log( 'MOver' );
    labelF.set( {'textBackgroundColor': labelF.highlightBackgroundColor} );
    canvas.requestRenderAll();
  });
  labelF.on( 'mouseout', function (opt) {
    console.log( 'MOut' );
    labelF.set( {'textBackgroundColor': labelF.copyTextBackgroundColor} );
    canvas.requestRenderAll();
  });
  canvas.add( labelF );
  
  return labelF;                               
}
function editFactionF( labelF, factionM ) {
  labelF.set( {'text' : 'F'+factionM.id+': '+factionM.name } );
}
// ************************************************************** END - FactionF

// *****************************************************************************
// ******************************************************************** FactionC
// *****************************************************************************
// Faction using React
//
// require: react, react-dom, Faction,  
// *****************************************************************************

// ****************************************************************** TextTRComp
// LABEL + INPUT
// - value : text value (default and changed)
// - keyName : unique ref
// - onValueChange : cbk to call when value is changed

const TextCellC = (props) => {
  //const [val, setVal] = React.useState('??');
  /* function handleValueChange() {
   *   console.log( "TextRRFC::handleValueChange" );
   * } */

  const handleValueChange = (event) => {
    props.setValue( event.target.value );
    //props.onValueChange( props.keyName, event.target.value );
  }
  
  return (
    <tr>
      <td><label>{props.title} : </label></td>
      <td>
        <input
          type="text"
          value={props.value}
          onChange={handleValueChange}
        />
      </td>
    </tr>
  );
}


// *****************************************************************************
// ******************************************************************** FactionC
// FactionM, mode="edit"|"add", setFactionHandle, addCallback
const FactionC = (props) => {
  //console.log( 'New FC for '+props.faction.name );
  const [name, setName] = React.useState( props.factionM.name );
  const [id, setId] = React.useState( props.factionM.id );
  const [mode, setMode] = React.useState( props.mode );
  const [x, setX] = React.useState( props.pos.x );
  const [y, setY] = React.useState( props.pos.y );
  
  const setFaction = (factionM, pos, mode) => {
    setName( factionM.name );
    setId( factionM.id );
    setMode( mode );
    setX( pos.x );
    setY( pos.y );
    //console.log( 'FC: setFaction' );
  }
  props.setFactionHandle( setFaction );
  // props.addListener( setFaction );
  
  const handleBtnAdd = () => {
    props.addCallback( new FactionM( id, name), {x:x, y:y} );
    //console.log( "FactionC name=", name, ", id=", id );
  }
  const handleBtnEdit = () => {
    props.editCallback( new FactionM( id, name), {x:x, y:y} );
  }
  const handleBtnCancel = () => {
    displayPopup( false );
  }

  // Prevent from being used everytime with no change ?
  /* React.useEffect( () => {
   *   console.log( "FC: start use Effect" );

   *   return function cleanup() { // could be anonymus or arrow fct
   *     console.log( "FC: cleanup" );
   *   };
   * }); */

  var buttonAdd  = <button onClick={handleBtnAdd}>Add</button>;
  var buttonEdit = <button onClick={handleBtnEdit}>Edit</button>;
  
  if (mode === "edit") {
    buttonAct = buttonEdit;
  }
  else {
    buttonAct = buttonAdd;
  }
  let buttonCancel = <button onClick={handleBtnCancel}>Cancel</button>;
  
  return (
    <div>
      <fieldset>
        <legend>Faction ({id}) </legend>
        <table>
          <tbody>
            <TextCellC
              title="Name"
              setValue={setName}
              value={name}
            />
          </tbody>
        </table>
        {mode === "edit" ? buttonEdit : buttonAdd}&nbsp;{buttonCancel}
      </fieldset>
    </div>
  );
}
// ************************************************************** END - FactionC

// *****************************************************************************
// ***************************************************************** ListFaction
// *****************************************************************************
// Require: FactionM, canvas (fabric)
var _listFactionM = [];
function newFactionAction( factionM, pos ) {
  var nf = makeNewFactionM( factionM.name );
  var newFab = addFactionF( nf, pos, [0,0,255] );
  _listFactionM.push( {model:nf, view:newFab} );
  displayPopup( false );
}
function addFactionAction( factionM, pos ) {
  if (factionM.id < 0) {
    alert( "Cannot addFaction with improper id ("+factionM.id+")" );
    return;
  }
  if (_listFactionM[factionM.id]) {
    alert( "Cannot addFaction over existing one (id="+factionM.id+")" );
    return;
  }

  let newM = new FactionM( factionM.id, factionM.name );
  var newF = addFactionF( newM, pos, [0,0,255] );
  _listFactionM.push( {model:newM, view:newF} );
  displayPopup( false );
}
function editFactionAction( factionM ) {
  let view = _listFactionM[factionM.id].view;
  editFactionF( view, factionM );
  _listFactionM[factionM.id] = {model:factionM, view: view};
  displayPopup( false );
  canvas.renderAll();
}
function showAllFactionAction() {
  // make new array with data to archive
  let archive = _listFactionM.map( (item, index) => {
    return {
      factionM:item.model,
      pos:{x:item.view.left, y:item.view.top},
    };
  });
  
  let doc = JSON.stringify( archive );
  console.log( "__JSON" );
  console.log( doc );
  return doc;
}
function saveAllFactionAction() {
  let archive = _listFactionM.map( (item, index) => {
    return {
      factionM:item.model,
      pos:{x:item.view.left, y:item.view.top},
    };
  });
  let doc = JSON.stringify( archive );
  let jsonBlob = new Blob([doc],
                          { type: 'application/javascript;charset=utf-8' });
  saveAs( jsonBlob, "faction_data.json" );
}
function readAllFactionAction(file) {
  // Check right type (application/json)
  if (file.type && file.type.indexOf( 'application/json' ) === -1) {
    alert( "File "+file.name+" is not JSON file" );
    return;
  }

  const reader = new FileReader();
  reader.addEventListener( 'load', (event) => {
    console.log( "__READ loaded" );
    console.log( reader.result );
    populateFactionFromJSON( reader.result );
  });
  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`__READ Progress: ${Math.round(percent)}`);
    }
  });
  reader.readAsText(file); // when finished, will throw 'load'
}
function populateFactionFromJSON( doc ) {
  let archive = JSON.parse( doc );
  archive.forEach( (item,index) => {
    console.log( "["+index+"]=",item );
    addFactionAction( item.factionM, item.pos );
  });
}
// *********************************************************** END - ListFaction
  
// *****************************************************************************
// ********************************************************************* Actions
// *****************************************************************************
// Require: FactionC, Faction, 
var popupElement = document.getElementById( 'fabric_menu' );
// to prevent 'context menu for showing off
popupElement.addEventListener( 'contextmenu', function(event) {
  //console.log( "FabricMenu contextmenu", event.buttons );
  event.preventDefault();
  event.stopPropagation();
},
                               true /* capture */
);
function displayPopup( flag ) {
  if (flag) {
    popupElement.style.display = "block";
  }
  else {
    popupElement.style.display = "none";
  } 
}
const factionC = <FactionC
                   factionM={new FactionM( -1, 'name' )}
                   mode="add"
                   pos={{x: 100, y: 100}}
                   addCallback={newFactionAction}
                   editCallback={editFactionAction}
                   setFactionHandle={setFactionFunctor}
/>;
ReactDOM.render(
  factionC,
  document.getElementById( 'fabric_menu' )
);

function askNewFactionM( x, y ) {
  //console.log( 'askN',x,y );
  popupElement.style.left = x + 'px';
  popupElement.style.top = y + 'px';
  setFactionHandle( new FactionM( -1, 'faction_name' ), {x: x, y:y}, "add" );
  displayPopup( true );
}
function askEditFactionL( factionIDX, pos ) {
  console.log( 'askE',pos );
  popupElement.style.left = pos.x + 'px';
  popupElement.style.top = pos.y + 'px';
  setFactionHandle( _listFactionM[factionIDX].model, pos, "edit", );
  displayPopup( true );
}
function startRelationFromFactionL( factionIDX, posP ) {
  console.log( 'askNRFF', posP );
  // need to find FactionF related to this factionM
  let factionF = _listFactionM[factionIDX].view;
  startDrawArrow( factionF, posP );
}
// *************************************************************** END - Actions

// *****************************************************************************
// **************************************************************** Context Menu
// *****************************************************************************
const handleDummy = ( obj, pos ) => {
  console.log( "DUMMY", obj, pos );
}
var _factionContextMenu = [
  {label:"Edit", cbk:askEditFactionL},
  {label:"TODONew Relation", cbk:startRelationFromFactionL},
  {label:"<hr>",cbk:null}, // separator
  {label: "TodoDelete", cbk:handleDummy},
];

// FactionM, pos (x,y), 
// items = [ {label, cnk] OR {label:"<hr>", cbk:null} for sep ]
//
// will call cbk( factionM, pos )
const FactionMenu = (props) => {

  // Build menu Items
  const listItems = props.items.map( (item, index) => {
    if (item.label === "<hr>") {
      return(<hr key={index}/>);
    }
    return (
      <span
        key={index}
        onClick={() =>  {
          removeContextMenuC();
          item.cbk(props.factionIDX, props.pos)
        }}
      >
        {item.label}
      </span>
    );
  });
 
  return (
    <div className="vertical_menu">
    {listItems}
    </div>
  );
}
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
  }
  else {
    contextMenuE.style.display = "none";
  } 
}

var _contextMenuE;
function showContextMenuC( factionIDX, x, y ) {
  console.log( "showContextMenuC",factionIDX,x,y );
  _contextMenuE = document.createElement( "DIV" );
  contextMenuE.appendChild( _contextMenuE );
  _contextMenuE.innerHTML = "CMenu at "+x+"px, ",y+" px";
  
  contextMenuE.style.left = x + 'px';
  contextMenuE.style.top = y + 'px';

  ReactDOM.render(
    <FactionMenu
      factionIDX={factionIDX}
      pos={{x:x, y:y}}
      items={_factionContextMenu}
    />,
    _contextMenuE );
  displayContextMenu( true );
}
function removeContextMenuC() {
  console.log( "removeContextMenuC");
  _contextMenuE.remove();
  displayContextMenu( false );
}
// ************************************************************ END Context Menu

// *****************************************************************************
// ******************************************************************* DrawArrow
// *****************************************************************************
var _stateDA = "none"; // none | drawing
var _srcFDA;
var _lineDA;
function startDrawArrow( srcF, mouseP ) {
  _stateDA = "drawing";
  // Create a new line from srcF.left/top to mouseP.x/y
  _lineDA = new fabric.Line( [srcF.left, srcF.top, mouseP.x, mouseP.y ], {
    stroke: 'red',
    selectable: false,
  });
  canvas.add( _lineDA );
}
function updateDrawArrow( mouseP ) {
  // Update line to mouseP.x/y
  _lineDA.set( {'x2': mouseP.x, 'y2': mouseP.y} );
  //_lineDA.setCoords();
  //_lineDA.set('dirty', true);
  canvas.requestRenderAll();
}
function abortDrawArrow() {
  console.log( "abortDA" );
  if (_stateDA === "drawing" ) {
    _stateDA = "none";
    canvas.remove( _lineDA );
  }
}
function endDrawArrow( itemF ) {
  console.log( "endDA", itemF );
  // check it is a Faction
  if (itemF.type && itemF.type === "FactionF" ) {
    _stateDA = "none";
    // Remove line
    canvas.remove( _lineDA );
    // create new relation
    console.log( "TODO createNewRelation" );
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
// ************************************************************* Fabric Callback
// *****************************************************************************
// Require: Action, fabric
canvas.on( 'mouse:down', function (opt) {
  console.log( 'D',opt );
  if (opt.e.button === 0) {
    if (opt.target === null) {
      // while drawingArrow
      if (isDrawArrow()) {
        console.log( "ED 1 display null" );
        abortDrawArrow();
        return;
      }
    }
    else {
      // while drawingArrow
      if (isDrawArrow()) {
        console.log( "ED 1 display target" );
        endDrawArrow( opt.target );
        return
      }
    }
  }
  // RightClick
  if (opt.e.button === 2) {
    if (opt.target === null) {
      // while drawingArrow
      if (isDrawArrow()) {
        console.log( "ED 2 display null" );
        abortDrawArrow();
        return;
      }
      //use mouseEvent to know absolute position
      askNewFactionM( opt.e.x, opt.e.y );
      //opt.e.preventDefault(); // no propagation of mouse event
      //opt.e.stopPropagation();
    }
    else {
      // while drawingArrow
      if (isDrawArrow()) {
        console.log( "ED 2 display target" );
        endDrawArrow( opt.target );
        return
      }
      // console.log( "RC: ",opt );
      // console.log( "  F:",_listFaction[opt.target.id] );
      //askEditFactionM( _listFactionM[opt.target.id].model, opt.e.x, opt.e.y );
      showContextMenuC( opt.target.id, opt.e.x, opt.e.y);
    }
  }
  /* if (event.button === 2) {
   *   console.log("right click");
   *   console.log( "X=",opt.e.x );
   *   popupElement.style.left = opt.e.x + 'px';
   *   popupElement.style.top = opt.e.y + 'px';
   *   //askNewFaction( opt.e.x, opt.e.y );
   *   
   * } */
});
canvas.on( 'mouse:move', function (opt) {
  //console.log( 'M', opt );
  if (isDrawArrow()) {
    console.log( "M udateDrawArrow", opt.absolutePointer );
    updateDrawArrow( opt.absolutePointer);
  }
});
/* canvas.on( 'mouse:up', function (opt) {
 *   //console.log( 'U', opt );
 *   if (opt.e.button === 2) {
 *     if (_stateDA === "drawing") {
 *       console.log( "U endDrawArrow" );
 *       _stateDA = "none";
 *     }
 *   }
 * });*/
// ******************************************************* End - Fabric Callback


//console.log( 'VERSION=',fabric.version );

// *****************************************************************************
// ********************************************************************* Buttons
function btnInfo() {
  console.log( "__Factions ("+_listFactionM.length+")" );
  console.log( _listFactionM );
  _listFactionM.forEach( (factionM) => {
    console.log( factionM.model.strDisplay() )
  });
  showAllFactionAction();
}
function btnSave() {
  saveAllFactionAction();
}
function btnLoad(event) {
  console.log( "__Load e=",event );
  readAllFactionAction( event.target.files[0] );
}
// ***************************************************************** END Buttons
