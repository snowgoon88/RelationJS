import React, { Component } from "react";
import { TextCellC } from './cellC.jsx';
import { SelectC } from './selectC.jsx';

/*
import { createPersonC } from 'path/personC.jsx';
 */

// *****************************************************************************
// ********************************************************************* PersonC
// PROPS: id, name, factionsName, okCbk, cancelCbk
const PersonC = (props) => {
  const [name, setName] = React.useState( props.name );
  const [factions, setFactions] = React.useState( [] );
  
  const handleBtnOK = () => {
    props.okCbk( {name: name, factions: factions} );
  }
  const handleBtnCancel = () => {
    props.cancelCbk();
  }

  const handleChange = (listFactions) => {
    console.log( "PersonC.handleChange", listFactions );
    setFactions( listFactions );
  }
  
  var buttonOK = <button onClick={handleBtnOK}>Ok</button>;
  var buttonCancel = <button onClick={handleBtnCancel}>Cancel</button>;

  // render
  return (
    <div>
      <fieldset>
        <legend>Person ({props.id}) </legend>
        <table>
          <tbody>
            <TextCellC
              title="Name"
              onValueChange={setName}
              value={name}
            />
            <tr>
              <td><label>Factions : </label></td>
              <td>
                <SelectC
                  options={props.factionsName}
                  value=""
                  onChange={setFactions}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>
      {buttonOK}{buttonCancel}
    </div>
  );
}
export function createPersonC( fieldsPersonM, factionsName, okCbk, cancelCbk ) {
  return (
    <PersonC
      id={fieldsPersonM.id}
      name={fieldsPersonM.name}
      factionsName={factionsName}
      okCbk={okCbk}
      cancelCbk={cancelCbk}
    />
  );
}
// *************************************************************** END - PersonC
