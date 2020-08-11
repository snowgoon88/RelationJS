// *****************************************************************************
// ********************************************************************* SelectC
//
// props: value, options
// uses: 
// require:

const SelectC = (props) => {
  console.log( "SelectC.create" );
  const [value, setValue] = React.useState( props.value );
  const [hiddenPopup, setHiddenPopup] = React.useState( true );
  const [options, setOptions] = React.useState( props.options );
  const [idxChoice, setIdxChoice] = React.useState( 0 );

  // reference to input Element, through each instance of Component
  // easier to get value, NEED ref={inputRef} in input DOM
  // TODO usefull 
  const inputRef = React.useRef();

  /* /*const handleChange = (event) => {
   *   console.log( "SelectC.handleChange", event.target.value );
   * }/ */
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
      let tmpOptions = props.options.filter( (item) => pattern.test( item ) );
      if( tmpOptions.length > 0 ) {
        setOptions( props.options.filter( (item) => pattern.test( item ) ));
        setIdxChoice( 0 );
      }
      else {
        setOptions( ["Choix impossible"] );
        setIdxChoice( -1 );
      }
    }
    else {
      setOptions( props.options );
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log( "SelectC.submit" );
    if( idxChoice >= 0 ) {
      console.log( "  valid=", options[idxChoice] );
      setValue( options[idxChoice] );
      setHiddenPopup( true );
    }
    else {
      alert( "Invalid choice" );
    }
  }
  const handleCleanup = (event) => {
    setValue( "" );
    setOptions( props.options );
    setIdxChoice( 0 );
    setHiddenPopup( true );
  }
  
  const listOptions = options.map( (item,index) =>
    <li key={index}
        value="{item}"
        patt-selected={index == idxChoice ? "true" : "false"}>
      {item}
    </li>
  );
  const clearIcon =
    <div onClick={handleCleanup} className="icon_container">
      <svg height="20" width="20" viewBox="0 0 20 20" focusable="false"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>
    </div>;

  /* const handleBtnHide = (event) => {
   *   // use updator to take into account old value of hiddenPopup
   *   setHiddenPopup( hiddenPopup => !hiddenPopup );
   * } */
  const handleInputFocus = (event) => {
    console.log( "SelectC.handleInputFocus" );
    setHiddenPopup( false );
  }
  /* const handleBtnA = (event) => {
   *   // add if missing, otherwise remove
   *   // using operation that create new array, to trigger re-render
   *   if (tab.find( item => item == 'A' )) {
   *     setTab( tab.filter( item => item != 'A' ));
   *   }
   *   else {
   *     setTab( [...tab, 'A'] );
   *   }
   * }
   * const handleBtnB = (event) => {
   *   // add if missing, otherwise remove
   *   // using operation that create new array, to trigger re-render
   *   if (tab.find( item => item == 'B' )) {
   *     setTab( tab.filter( item => item != 'B' ));
   *   }
   *   else {
   *     setTab( [...tab, 'B'] );
   *   }
   * }
   * const handleBtnC = (event) => {
   *   console.log( "Select.handleBtnC tab=",tab );
   *   // add if missing, otherwise remove
   *   // using operation that create new array, to trigger re-render
   *   if (tab.find( item => item == 'C' )) {
   *     setTab( tab.filter( item => item != 'C' ));
   *   }
   *   else {
   *     setTab( [...tab, 'C'] );
   *   }
   *    
   *  */      
  // need to copy on tab because hase to change tab
  //setTab( [ ...tab, 'C'] );
  /* let nTab = tab;
   * nTab.push( 'V' );
   * console.log( "  newTab=",nTab, (tab == nTab), (tab === nTab), (nTab == nTab.slice()), (nTab === nTab.slice()) );
   * setTab( nTab.slice() ); */
  //setTab( tab => tab.push( 'C' ) );
  //}
  
  // render
  return (
    <div
      //onKeyPress={handleKeyPress}
      onKeyUp={handleKeyUp}
      //onInput={handleInput}
    >
      {/* <div>
          <button onClick={handleBtnHide}>Hide/show</button>
          </div> */}
      <form
        onSubmit={handleSubmit}
      >
        <div>
          Truc
          <input
          //ref={inputRef}
            type="text"
            value={value}
            onInput={handleInput}
            onChange={handleChangeText}
            onFocus={handleInputFocus}
          />
          {clearIcon}
          <button>V</button>
        </div>
        <div className={`popup ${hiddenPopup ? "hidden" : ""}`}>
          <ul className="dropdown">
            {listOptions}
          </ul>
        </div>
      </form>
      {/* <div>
          <button onClick={handleBtnA}>A</button>
          <button onClick={handleBtnB}>B</button>
          <button onClick={handleBtnC}>C</button>
          </div>
          <div>
          tab=[{tab.toString()}]
          </div> */}
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


/* <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-6q0nyr-Svg"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg> */
