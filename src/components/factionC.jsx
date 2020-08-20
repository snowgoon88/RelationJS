import React, { Component } from "react";
import {TextCellC, ColorCellC} from './cellC.jsx';

/*
import {createFactionC} from 'path/factionC.jsx';
*/
// *****************************************************************************
// ******************************************************************** FactionC
// PROPS: id, name, okCbk, cancelCbk
const NameFactionC = (props) => {
  const [name, setName] = React.useState( props.name );
  const [color, setColor] = React.useState( props.color );
  
  const handleBtnOK = () => {
    console.log( "NameFactionC ", name, color );
    props.okCbk( {name:name, color:color} );
  }
  const handleBtnCancel = () => {
    props.cancelCbk();
  }

  var buttonOK = <button onClick={handleBtnOK}>Ok</button>;
  var buttonCancel = <button onClick={handleBtnCancel}>Cancel</button>;

  // render
  return (
    <div>
      <fieldset>
        <legend>Faction ({props.id}) </legend>
        <table>
          <tbody>
            <TextCellC
              title="Name"
              onValueChange={setName}
              value={name}
            />
            <ColorCellC
              title="Color"
              color={color}
              onColorCompleteCbk={setColor}
            />
          </tbody>
        </table>
      </fieldset>
      {buttonOK}{buttonCancel}
    </div>
  );
}
export function createFactionC( fieldsFactionM, okCbk, cancelCbk ) {
  return (
    <NameFactionC
      id={fieldsFactionM.id}
      name={fieldsFactionM.name}
      color={fieldsFactionM.color}
      okCbk={okCbk}
      cancelCbk={cancelCbk}
    />
  );
}
// *************************************************************** END -FactionC
