import React, { Component } from "react";
import {TextCellC} from './cellC.jsx';

/*
import {createRelationC} from 'path/relationC.jsx';
 */
// *****************************************************************************
// ******************************************************************* RelationC
// PROPS: id, name, okCbk, cancelCbk
const RelationC = ( props ) => {
  const [name, setName] = React.useState( props.name );

  const handleBtnOK = () => {
    console.log( "RelationC ", name );
    props.okCbk( {name:name} );
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
        <legend>Relation ({props.id}) </legend>
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
export function createRelationC( fieldsRelationM, okCbk, cancelCbk ) {
  return (
    <RelationC
      id={fieldsRelationM.id}
      name={fieldsRelationM.name}
      okCbk={okCbk}
      cancelCbk={cancelCbk}
    />
  );
}
// ************************************************************* END - RelationC
