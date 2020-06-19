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
class Faction {
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
function makeNewFaction( name ) {
  var nf = new Faction( _idmax_faction, name );
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
function addFactionF( faction, pos, colorRGB ) {
  let colRGBA = 'rgba( '+colorRGB[0]+', '+colorRGB[1]+', '+colorRGB[2]+', 0.2)';
  var labelF = new fabric.IText( 'F'+faction.id+': '+faction.name, {
    id: faction.id,
    left: pos.x,
    top: pos.y,
    fontSize: 20,
    fontWeight: 'bold',
    underline: 'true',
    textBackgroundColor: colRGBA,
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
  canvas.add( labelF );
  
  return labelF;                               
}
function editFactionF( labelF, faction ) {
  labelF.set( {'text' : 'F'+faction.id+': '+faction.name } );
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
// Faction, mode="edit"|"add", setFactionHandle, addCallback
const FactionC = (props) => {
  //console.log( 'New FC for '+props.faction.name );
  const [name, setName] = React.useState( props.faction.name );
  const [id, setId] = React.useState( props.faction.id );
  const [mode, setMode] = React.useState( props.mode );
  const [x, setX] = React.useState( props.pos.x );
  const [y, setY] = React.useState( props.pos.y );
  
  const setFaction = (faction, pos, mode) => {
    setName( faction.name );
    setId( faction.id );
    setMode( mode );
    setX( pos.x );
    setY( pos.y );
    //console.log( 'FC: setFaction' );
  }
  props.setFactionHandle( setFaction );
  // props.addListener( setFaction );
  
  const handleBtnAdd = () => {
    props.addCallback( new Faction( id, name), {x:x, y:y} );
    //console.log( "FactionC name=", name, ", id=", id );
  }
  const handleBtnEdit = () => {
    props.editCallback( new Faction( id, name), {x:x, y:y} );
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
// Require: Faction, canvas (fabric)
var _listFaction = [];
function newFactionAction( faction, pos ) {
  var nf = makeNewFaction( faction.name );
  var newFab = addFactionF( nf, pos, [0,0,255] );
  _listFaction.push( {model:nf, view:newFab} );
  displayPopup( false );
}
function editFactionAction( faction ) {
  let view = _listFaction[faction.id].view;
  editFactionF( view, faction );
  _listFaction[faction.id] = {model:faction, view: view};
  displayPopup( false );
  canvas.renderAll();
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
                   faction={new Faction( -1, 'name' )}
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

function askNewFaction( x, y ) {
  //console.log( 'askN',x,y );
  popupElement.style.left = x + 'px';
  popupElement.style.top = y + 'px';
  setFactionHandle( new Faction( -1, 'faction_name' ), {x: x, y:y}, "add" );
  displayPopup( true );
}
function askEditFaction( faction, x, y ) {
  //console.log( 'askE',x,y );
  popupElement.style.left = x + 'px';
  popupElement.style.top = y + 'px';
  setFactionHandle( faction, {x: x, y:y}, "edit", );
  displayPopup( true );
}
// *************************************************************** END - Actions

// *****************************************************************************
// ************************************************************* Fabric Callback
// *****************************************************************************
// Require: Action, fabric
canvas.on( 'mouse:down', function (opt) {
  //console.log( 'E',opt );
  // RightClick
  if (opt.e.button === 2) {
    if (opt.target === null) {
      //use mouseEvent to know absolute position
      askNewFaction( opt.e.x, opt.e.y );
      //opt.e.preventDefault(); // no propagation of mouse event
      //opt.e.stopPropagation();
    }
    else {
      // console.log( "RC: ",opt );
      // console.log( "  F:",_listFaction[opt.target.id] );
      askEditFaction( _listFaction[opt.target.id].model, opt.e.x, opt.e.y );
      
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
// ******************************************************* End - Fabric Callback


//console.log( 'VERSION=',fabric.version );

// *****************************************************************************
// ********************************************************************* Buttons
function btnInfo() {
  console.log( "__Factions ("+_listFaction.length+")" );
  _listFaction.forEach( (faction) => {
    console.log( faction.model.strDisplay() )
  });
};
