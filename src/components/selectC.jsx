import React, { Component } from "react";

/*
import { SelectC } from 'path/selectC.jsx';
*/
// *****************************************************************************
// ********************************************************************* SelectC
// TODO: better structure passed down from NewPersonC ?
// in 'choices' = [ {id, label} ], so when signaling up, need to pass only
// a list of [labels]
//
// PROPS: - options = [ names ] : possible choices
//        - choices = [ names ] : starting choices
//        - value : default value in input field
//        - onChange( [ names ] ) : Cbk when a change in choices is made
//        TODO - choices = [ name ] : existing choices

export function SelectC(props) {
  console.log( "SelectC.create, options=", props.options, "choices=", props.choices );
  // value of the input field
  const [value, setValue] = React.useState( props.value );
  // hide/show the popup where options are displayed
  const [hiddenPopup, setHiddenPopup] = React.useState( true );
  // list of options, filtered by the current value
  const [options, setOptions] = React.useState( props.options );
  // idx of the option with the current choice
  const [idxChoice, setIdxChoice] = React.useState( 0 );
  // list of current choices already made [ {ids_of_choices in props.options, label} ]
  let startChoices = props.choices.map( (name,idx) => {
    return {id:props.options.indexOf( name ), label:name};
  });
  console.log( "  startChoices=", startChoices );
  const [choices, setChoices] = React.useState( startChoices );

  // reference to input Element, through each instance of Component
  // easier to get value, NEED ref={inputRef} in input DOM
  // TODO usefull ?? 
  const inputRef = React.useRef();

  // ************************************************************* manageChoices
  const addToChoices = (label) => {
    let maxId = choices.reduce( (curMax, curItem) => Math.max(curMax, curItem.id), 0);
    let tmpChoices = [...choices, {
      label: label,
      id: maxId+1,
    }];
    setChoices( tmpChoices );
    props.onChange( tmpChoices.map( (item,idx) => item.label ));
  }
  const removeChoice = (id) => {
    let tmpChoices = choices.filter( (item) => item.id != id );
    setChoices( tmpChoices );
    props.onChange( tmpChoices.map( (item,idx) => item.label ) );
  }

  // ******************************************************************* actions
  const resetInput = () => {
    setValue( "" );
    setHiddenPopup( true );
    setOptions( props.options );
    setIdxChoice( 0 );
  }

  
  const handleChangeText = (event) => {
    console.log( "SelectC.handleChangeText", event.target.value );
    setValue( event.target.value );
  }
  
  const handleKeyUp = (keyEvent) => {
    console.log( "SelectC.kUp", keyEvent.key, keyEvent.code, keyEvent.keyCode );

    // abort if escape
    if( keyEvent.key == "Escape" ) {
      resetInput();
      return;
    }
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

    setHiddenPopup( false );
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
      /* setValue( options[idxChoice] );
       * setHiddenPopup( true ); */

      addToChoices( options[idxChoice] );
      resetInput();
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
  const handlePopup = (event) => {
    setHiddenPopup( hiddenPopup => !hiddenPopup );
  }
  
  const handleDeleteChoice = (id) => {
    console.log( "SelectC.handleDeleteChoice id=",id );
    removeChoice( id );
  }
    
  const listChoices = choices.map( (item,index) => 
    <ChoiceC
      key={item.id}
      label={item.label}
      id={item.id}
      deleteCbk={handleDeleteChoice}
    />
  );
  
  const handleOptionChoice = (event, id) => {
    console.log( "Select.handleOptionChoice", id );
    addToChoices( options[id] );
    resetInput();
  }
  
  const listOptions = options.map( (item,index) =>
      <li key={index}
          value="{item}"
          patt-selected={index == idxChoice ? "true" : "false"}
          onClick={(e) => handleOptionChoice(e, index)}
      >
        {item}
      </li>
  );
  const clearIcon =
    <div onClick={handleCleanup}
         className={`icon_container ${value =="" ? "invisible" : ""}`}>
      <svg height="20" width="20" viewBox="0 0 20 20" focusable="false"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>
    </div>;
  const separatorIcon =
    <span className="icon_separator">
    </span>;
  const popupIcon =
    <div onClick={handlePopup} className="icon_container">
      <svg height="20" width="20" viewBox="0 0 20 20" focusable="false"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
    </div>;

  /* const handleBtnHide = (event) => {
   *   // use updator to take into account old value of hiddenPopup
   *   setHiddenPopup( hiddenPopup => !hiddenPopup );
   * } */
  const handleInputFocus = (event) => {
    console.log( "SelectC.handleInputFocus" );
    setHiddenPopup( false );
  }


  const handleBtnDebug = (event) => {
    console.log( "__DEBUG" );
    console.log( "  choices=", choices );
    console.log( "  value=", value );
  }
  const btnDebug = <button onClick={handleBtnDebug}>DEBUG</button>;
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
    <div className="select_container"
      //onKeyPress={handleKeyPress}
         onKeyUp={handleKeyUp}
      //onInput={handleInput}
    >
      {/* <div>
          <button onClick={handleBtnHide}>Hide/show</button>
          </div> */}
      <div className="all_choices">
        {listChoices}
      </div>
      <div className="input_container">

        <form
          onSubmit={handleSubmit}
        >
          <div>
          <input
          //ref={inputRef}
            type="text"
            value={value}
            onInput={handleInput}
            onChange={handleChangeText}
            onFocus={handleInputFocus}
          />
          {clearIcon}
          {separatorIcon}
          {popupIcon}
          </div>
          <div className={`popup ${hiddenPopup ? "hidden" : ""}`}>
            <ul className="dropdown">
              {listOptions}
            </ul>
          </div>
        </form>
      </div>
        //{btnDebug}
    </div>
  );
}
// *************************************************************** END - SelectC

// *****************************************************************************
// ********************************************************************* ChoiceC
//
// props: label, id, deleteCbk(id)
function ChoiceC(props) {

  const handleDelete = (event) => {
    props.deleteCbk( props.id )
  }
  const deleteIcon =
    <div onClick={handleDelete}
         className="icon_container deleter">
      <svg height="20" width="20" viewBox="0 0 20 20" focusable="false"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>
    </div>;
  
  // render
  return (
    <div className="choice_container">
      <span className="choice_label">{props.label}</span>
      {deleteIcon}
    </div>
  );
}
// *************************************************************** END - ChoiceC

// *****************************************************************************
// **************************************************************** regExpEscape
// Escape Regex patterns
function regExpEscape(s) {
  return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
}
// ********************************************************** END - regExpEscape

// *****************************************************************************
// **************************************************************** TEST SelectC
// 
/* var _choices = [ "Rouge", "Vert", "Bleu", "Route", "Bouge", "Blouse" ];
 * 
 * const tmpHook = (id) => {
 *   console.log( "TMP id=",id );
 * }
 * 
 * ReactDOM.render(
 *   <div>
 *     <SelectC
 *       options={_choices}
 *       value={""}
 *     />
 *     <div>
 *       <ChoiceC
 *         label="A effacer"
 *         id="3" 
 *         deleteCbk={tmpHook}
 *       />
 *     </div>
 *   </div>
 *   ,
 *   document.getElementById( "react_sandbox" )
 * );
 *  */

/* <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-6q0nyr-Svg"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg> */

/* <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-6q0nyr-Svg"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg> */

//<path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
