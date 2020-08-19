import React, { Component } from "react";
import {TextCellC} from './textCellC.jsx';

// *****************************************************************************
// ******************************************************************** FactionC
// PROPS: id, name, okCbk, cancelCbk
const NameFactionC = (props) => {
  const [name, setName] = React.useState( props.name );

  const handleBtnOK = () => {
    props.okCbk( name );
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
          </tbody>
        </table>
      </fieldset>
      {buttonOK}{buttonCancel}
    </div>
  );
}
export function createFactionC( id, name, okCbk, cancelCbk ) {
  return (
    <NameFactionC
      id={id}
      name={name}
      okCbk={okCbk}
      cancelCbk={cancelCbk}
    />
  );
}
// *************************************************************** END -FactionC
