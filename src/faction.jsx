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
    this.type = 'FactionM';
    this.viewF = null;      // FabricJS view
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
function makeNewFactionIdM( id, name ) {
  if (id < _idmax_faction) {
    alert( "Cannot make new faction with improper id ("+id+")" );
    return;
  }
  var nf = new FactionM( id, name );
  _idmax_faction = id+1;

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
// require: fabric.js, canvas
// IText has NO border (the border is only when selected)
var _colHiglightRGBA = "rgba( 255, 0, 0, 0.2)";
function addFactionF( factionM, pos, colorRGB ) {
  let colRGBA = 'rgba( '+colorRGB[0]+', '+colorRGB[1]+', '+colorRGB[2]+', 0.2)';
  var labelF = new fabric.IText( 'F'+factionM.id+': '+factionM.name, {
    id: factionM.id,
    model: factionM,
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
  factionM.viewF = labelF;
  
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
  // When multiple Objects are selected (like two FactionF)
  // the individual elements DO NOT receive 'moved' or 'modified' event.
  // We have to operate on canvas directly.
  /* labelF.on( 'modified', function (opt) {
   *   console.log( 'EMod', opt );
   *   let allRelationM = findRelationMWith( opt.target.model );
   *   allRelationM.forEach( (itemM,idx) => itemM.viewF.updateEnds() );
   * });
   * labelF.on( 'moved', (opt) => {
   *    console.log( 'moved ', labelF.model.name ); 
   * }); */
  canvas.add( labelF );
  
  return labelF;                               
}
function movedFactionF( itemF ) {
  console.log( 'movedFactionF ', itemF.model.name );
  let allRelationM = findRelationMWith( itemF.model );
  allRelationM.forEach( (itemM,idx) => itemM.viewF.updateEnds() );
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
  nf.viewF = newFab;
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

  let newM = makeNewFactionIdM( factionM.id, factionM.name );
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
// ******************************************************************* RelationM
// *****************************************************************************
// require: 
class RelationM {
  constructor( id, name, srcFactionM, destFactionM ) {
    this.id = id;
    this.name = name;
    this.srcM = srcFactionM;
    this.destM = destFactionM;
    this.type = 'RelationM';
    this.viewF = null;
  }
  strDisplay() {
    let display = 'R['+this.id+']: '+this.name;
    return display;
  }
}
// ***** to Manage Faction.id
var _idmax_relation = 0;
function makeNewRelationM( name, srcFactionM, destFactionM ) {
  var nr = new RelationM( _idmax_relation, name, srcFactionM, destFactionM );
  _idmax_relation += 1;

  return nr;
}
// ************************************************************* END - RelationM

// *****************************************************************************
// ******************************************************************* Vec {x,y}
// *****************************************************************************
class Vec {
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
function intersectRectVec( itemF, vec ) {
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
function segmentPointVec( srcV, destV, abs ) {
  let x = srcV.x + abs * (destV.x - srcV.x);
  let y = srcV.y + abs * (destV.y - srcV.y);
  return new Vec(x,y);
}
// Compute a bezier point with absice 'abs'
function computeBezierPointVec( srcV, destV, ctrlV, abs ) {
  let pt1 = segmentPointVec( srcV, ctrlV, abs );
  let pt2 = segmentPointVec( ctrlV, destV, abs );
  return segmentPointVec( pt1, pt2, abs );
}
// ******************************************************************* END - Vec

// *****************************************************************************
// ******************************************************************* RelationF
// *****************************************************************************
// require: fabric.js, canvas, Vector
// A RelationF is made of:
// - pathF [fabric.Path] : the bezier path
// - headF [fabric.Triangle] : arrow head
// - ctrlF [fabric.Circle] : ctrl Point for the path
// - midF [???] : point a the middle abscisse of the path
// - labelF [fabric.] : the text, near the mid point
class RelationF {
  constructor( relationM, colRGB ) {
    this.model = relationM;
    // default path is 100,100 --<150,90>--> 200,100
    this.srcPt =  new Vec( 100, 100 );
    this.ctrlPt = new Vec( 150,  80 );
    this.destPt = new Vec( 200, 100 );
    this.midPt = computeBezierPointVec( this.srcPt, this.destPt,
                                        this.ctrlPt, 0.5 );

    // FabricJS elements
    this.pathF = new fabric.Path( 'M100,100 Q150,80 200,100', {
      stroke: colRGB,
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
    });
    this.ctrlF = new fabric.Circle({
      originX: 'center',
      originY: 'center',
      left: 150,
      top: 80,
      radius: 10,
      stroke: colRGB,
      fill: colRGB,
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
    
    this.headF = new fabric.Triangle({
      originX: 'center',
      left: 10,
      //originY: 'center',
      top: 10,
      width: 12,
      height: 20,
      stroke: colRGB,
      fill: colRGB,
      selectable: false,
      hasControls: false,
      hasRotatingPoint: false,
      lockRotation: true,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockSkewingX: true,
      lockSkewingY: true,
    });
    this.labelF = new fabric.IText( relationM.id+': '+relationM.name, {
      originX: 'center',
      originY: 'center',
      left: this.midPt.x,
      top: this.midPt.y,
      fontSize: 16,
      fill: colRGB,
      selectable: false,
      hasRotatingPoint: false,
      lockRotation: true,
      lockScalingX: true,
      lockSclaingY: true,
      lockSkewingX: true,
      lockSkewingY: true,
      //padding: 10,
      // IText
      editable: false,
  });
    
    
    let srcF = relationM.srcM.viewF;
    let destF = relationM.destM.viewF;
    this._updateWithNewEnds( srcF, destF );

    this.ctrlF.on( 'modified', (opt) => {
      console.log( 'modCtrl', opt );
      this.updateCtrl();
    });
    this.ctrlF.on( 'deselected', (opt) => {
      console.log( 'des opt=', opt );
      this.setInactive();
    });
    this.pathF.on( 'selected', (opt) => {      
      console.log( 'selPath opt=',opt );
      this.setActive();
    });

    canvas.add( this.pathF );
    canvas.add( this.headF );
    canvas.add( this.ctrlF );
    canvas.add( this.labelF );
  }
  // call when src or/and dest have moved
  updateEnds() {
    this._updateWithNewEnds( this.model.srcM.viewF, this.model.destM.viewF );
  }
  updateCtrl() {
    this.ctrlPt = new Vec( this.ctrlF.left, this.ctrlF.top );
    this.midPt = computeBezierPointVec( this.srcPt, this.destPt,
                                        this.ctrlPt, 0.5 );
    this.updatePath();
  }
  // set as the active Object
  setActive() {
    this.ctrlF.set( 'selectable', true );
    this.ctrlF.set( 'visible', true );
    canvas.setActiveObject( this.ctrlF );
  }
  setInactive() {
    console.log( 'Inactive' );
    this.ctrlF.set( 'selectable', false );
    this.ctrlF.set( 'visible', false );
  }
  
  // when src and/or dest have moved
  _updateWithNewEnds( srcF, destF ) {
    console.log( '  update', this.model.name );
    console.log( '  srcF', srcF );
    console.log( '    co', srcF.calcCoords() );
    console.log( '  destF', destF );
    console.log( '    co', destF.calcCoords() );
    destF.setCoords();
    console.log( '  destF', destF );
    let posSrcF = getPosF( srcF );
    let posDestF = getPosF( destF );
    let srcNew =  new Vec( posSrcF.left,  posSrcF.top );
    let destNew = new Vec( posDestF.left, posDestF.top);
    
    let srcCtrlOld = this.ctrlPt.minus( this.srcPt );
    let srcDestOld = this.destPt.minus( this.srcPt );
    let normOld = srcDestOld.norm();

    // Old projection of ctrlPt on local frame (src->dest)
    let ctrlXRatio = srcCtrlOld.dot( srcDestOld ) / (normOld * normOld);
    let ctrlYRatio = srcCtrlOld.dot( srcDestOld.perp()) / (normOld * normOld);

    // Actual projection
    let srcDest = destNew.minus( srcNew ); 
    let updCtrlX = srcDest.scalar( ctrlXRatio );
    let updCtrlY = srcDest.perp().scalar( ctrlYRatio );
    this.ctrlPt = new Vec( srcNew.x + updCtrlX.x + updCtrlY.x,
                           srcNew.y + updCtrlX.y + updCtrlY.y );

    // update ControlPointF
    this.ctrlF.set( {'left': this.ctrlPt.x, 'top': this.ctrlPt.y} );
    this.ctrlF.setCoords();

    // update EndPoints
    this.srcPt = srcNew;
    this.destPt = destNew;
    this.midPt = computeBezierPointVec( this.srcPt, this.destPt,
                                        this.ctrlPt, 0.5 );
    this.updatePath();
  }
  // call to recompute path
  updatePath() {
    // update PathF and arrowHead
    // taking into account the BBOX
    let srcF = this.model.srcM.viewF;
    let destF = this.model.destM.viewF;
    let posSrcF = getPosF( srcF );
    let posDestF = getPosF( destF );
    
    // update arrowHead
    let vecSC = this.ctrlPt.minus( this.srcPt );
    let srcCoord = intersectRectVec( posSrcF, vecSC );
    let vecDC = this.ctrlPt.minus( this.destPt );
    let destCoord= intersectRectVec( posDestF, vecDC );
    let arrowAngle =  Math.atan2( -vecDC.y, -vecDC.x );
    arrowAngle += Math.PI / 2.0;
    arrowAngle *= 180.0 / Math.PI;
    this.headF.set( {'left': destCoord.x, 'top': destCoord.y,
                     'angle': arrowAngle} );
    this.headF.setCoords();

    this.labelF.set( {'left': this.midPt.x, 'top': this.midPt.y } );
    this.labelF.setCoords();
    
    this.pathF.set( 'path', this._toPathArray( srcCoord, destCoord ) );
    let dims = this.pathF._calcDimensions();
    this.pathF.set( {
      width: dims.width,
      height: dims.height,
      left: dims.left,
      top: dims.top,
      pathOffset: {
        x: dims.width / 2 + dims.left,
        y: dims.height / 2 + dims.top
      },
      dirty: true
    });
    this.pathF.setCoords();
  }
  // build a proper SVG Array for path
  _toPathArray( srcV, destV) {
    let path = [];
    path.push( ["M", srcV.x, srcV.y] );
    path.push( ["Q", this.ctrlPt.x, this.ctrlPt.y, destV.x, destV.y] );
    return path;
  }
}
// ************************************************************* END - RelationF

// *****************************************************************************
// *************************************************************** ListRelationM
// *****************************************************************************
var _listRelationM = [];
function newRelationAction( srcF, destF ) {
  // check different items
  if (srcF.model === destF.model) {
    alert( "No Relation with same Element" );
    return;
  }
  var nrM = makeNewRelationM( 'TODOmakeR', srcF.model, destF.model );
  var nrF = new RelationF( nrM, 'red' );
  nrM.viewF = nrF;
  _listRelationM.push( nrM );

  // deselect everything except new relation
  canvas.discardActiveObject();
  nrF.setActive();
  
}
function findRelationMWith( itemM ) {
  let result = [];
  for( let idx=0; idx < _listRelationM.length; idx++ ) {
    let relationM = _listRelationM[idx];
    if (relationM.srcM === itemM || relationM.destM === itemM ) {
      result.push( relationM );
    }
  }
  return result;
}

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
var _srcFDA = null;
var _lineDA;
function startDrawArrow( srcF, mouseP ) {
  _stateDA = "drawing";
  _srcFDA = srcF;
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
    _srcFDA = null;
    canvas.remove( _lineDA );
  }
}
function endDrawArrow( itemF ) {
  console.log( "endDA", itemF );
  // check it is a Faction
  if (itemF.model && itemF.model.type === "FactionM" ) {
    _stateDA = "none";
    // Remove line
    canvas.remove( _lineDA );
    // create new relation
    console.log( "TODO createNewRelation" );
    // TPDO TMP
    newRelationAction( _srcFDA, itemF );
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
// **************************************************************** Fabric utils
// *****************************************************************************
// Compute position of a FabricItem, even if nested in a group/selection.
// Requirement: group.originX: left, group.originY. top
//
// Returns {left, top, width, height}
function getPosF( item ) {
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
  // Middle click
  if (opt.e.button === 1) {
    alert( "X="+opt.e.x+", Y="+opt.e.y );
  }
});
canvas.on( 'mouse:move', function (opt) {
  //console.log( 'M', opt );
  if (isDrawArrow()) {
    console.log( "M udateDrawArrow", opt.absolutePointer );
    updateDrawArrow( opt.absolutePointer);
  }
});

canvas.on( 'object:moved', (opt) => {
  // opt.target is an ActiveSelection or a 'rawObject'
  console.log( 'object:moved', opt );
  //console.log( '  moved ', opt.target.type );
  //console.log( '  moved ', typeof(opt.target) );

  if (opt.target.type === "activeSelection" ) {
    console.log( '  moving activeSelection', opt.target );
    opt.target.forEachObject( (itemF, idx) => {
      if (itemF.model.type === "FactionM") {
        movedFactionF( itemF );
      }
    });
  }
  else if (opt.target.model && opt.target.model.type === "FactionM") {
    movedFactionF( opt.target );
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
