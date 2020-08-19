import React, { Component } from "react";

// *****************************************************************************
// ******************************************************************* TextCellC
// PROPS: title, value, onValueChange(event)
export function TextCellC(props) {

  const handleValueChange = (event) => {
    props.onValueChange( event.target.value );
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
// ************************************************************* END - TextCellC
