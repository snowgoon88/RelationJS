// *****************************************************************************
// ********************************************************************* SelectC
//
// props: value, options
// uses: 
// require:

const SelectC = (props) => {
  console.log( "SelectC.create" );
  const [value, setValue] = React.useState( props.value );
  const [tab, setTab] = React.useState( ['A', 'B'] );
  const [hiddenPopup, setHiddenPopup] = React.useState( true );
  const [options, setOptions] = React.useState( props.options );
  const [idxChoice, setIdxChoice] = React.useState( 0 );

  // reference to input Element, through each instance of Component
  // easier to get value
  //const inputRef = React.useRef();

  const handleChange = (event) => {
    console.log( "SelectC.handleChange", event.target.value );
  }
  const handleChangeText = (event) => {
    console.log( "SelectC.handleChangeText", event.target.value );
    setValue( event.target.value );
  }

  const handleKeyPress = (keyEvent) => {
    console.log( "SelectC.kPress", keyEvent.key, keyEvent.code, keyEvent.keyCode );
  }
  const handleKeyUp = (keyEvent) => {
    console.log( "SelectC.kUp", keyEvent.key, keyEvent.code, keyEvent.keyCode );

    // move selection idx up or down if visible
    if (hiddenPopup == false) 
    if( keyEvent.key == "ArrowDown") {
      if( idxChoice < (options.length - 1)) {
        setIdxChoice( idxChoice => idxChoice + 1 );
      }
      else {
        setIdxChoice( 0 );
      }
    }
    else if( keyEvent.key == "ArrowUp") {
      if( idxChoice > 0 ) {
        setIdxChoice( idxChoice => idxChoice - 1 );
      }
      else {
        setIdxChoice( options.length - 1 );
      }
    }
  }
  const handleInput = (inputEvent) => {
    console.log( "SelectC.input", inputEvent.data, inputEvent.target.value );

    // must update list of options
    // search pattern, case insensitive
    if( inputEvent.target.value.length > 0 ) {
      let pattern = RegExp( regExpEscape(inputEvent.target.value), "i" );
    
      setOptions( props.options.filter( (item) => pattern.test( item ) ));
    }
    else {
      setOptions( props.options );
    }
  }
  
  const listOptions = options.map( (item,index) =>
    <li key={index}
        value="{item}"
        patt-selected={index == idxChoice ? "true" : "false"}>
      {item}
    </li>
  );

  const handleBtnHide = (event) => {
    // use updator to take into account old value of hiddenPopup
    setHiddenPopup( hiddenPopup => !hiddenPopup );
  }
  const handleInputFocus = (event) => {
    console.log( "SelectC.handleInputFocus" );
    setHiddenPopup( false );
  }
  const handleBtnA = (event) => {
    // add if missing, otherwise remove
    // using operation that create new array, to trigger re-render
    if (tab.find( item => item == 'A' )) {
      setTab( tab.filter( item => item != 'A' ));
    }
    else {
      setTab( [...tab, 'A'] );
    }
  }
  const handleBtnB = (event) => {
    // add if missing, otherwise remove
    // using operation that create new array, to trigger re-render
    if (tab.find( item => item == 'B' )) {
      setTab( tab.filter( item => item != 'B' ));
    }
    else {
      setTab( [...tab, 'B'] );
    }
  }
  const handleBtnC = (event) => {
    console.log( "Select.handleBtnC tab=",tab );
    // add if missing, otherwise remove
    // using operation that create new array, to trigger re-render
    if (tab.find( item => item == 'C' )) {
      setTab( tab.filter( item => item != 'C' ));
    }
    else {
      setTab( [...tab, 'C'] );
    }
     
        
    // need to copy on tab because hase to change tab
    //setTab( [ ...tab, 'C'] );
    /* let nTab = tab;
     * nTab.push( 'V' );
     * console.log( "  newTab=",nTab, (tab == nTab), (tab === nTab), (nTab == nTab.slice()), (nTab === nTab.slice()) );
     * setTab( nTab.slice() ); */
    //setTab( tab => tab.push( 'C' ) );
  }
  
  // render
  return (
    <div
      onKeyPress={handleKeyPress}
      onKeyUp={handleKeyUp}
      onInput={handleInput}
    >
      <div>
        <button onClick={handleBtnHide}>Hide/show</button>
      </div>
      <div>
        Truc
        <input
          type="text"
          value={value}
          onChange={handleChangeText}
          onFocus={handleInputFocus}
        />
        <button>V</button>
      </div>
      <div className={`popup ${hiddenPopup ? "hidden" : ""}`}>
        <ul className="dropdown">
          {listOptions}
        </ul>
      </div>
      <div>
        <button onClick={handleBtnA}>A</button>
        <button onClick={handleBtnB}>B</button>
        <button onClick={handleBtnC}>C</button>
      </div>
      <div>
        tab=[{tab.toString()}]
      </div>
    </div>
  );
}

// *****************************************************************************
// ******************************************************************* RelationC
// Escape Regex patterns
function regExpEscape(s) {
    return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
}

// *****************************************************************************
// **************************************************************** TEST SelectC
// 
var _choices = [ "Rouge", "Vert", "Bleu", "Route", "Bouge", "Blouse" ];

ReactDOM.render(
  <SelectC
    options={_choices}
    value={""}
  />,
  document.getElementById( "react_sandbox" )
);


