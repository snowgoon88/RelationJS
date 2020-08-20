import React, { Component } from "react";
import reactCSS from 'reactcss';
import { SwatchesPicker } from 'react-color'

/*
import {TextCellC, ColorCellC} from 'path/cellC.jsx';
*/
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

// *****************************************************************************
// ****************************************************************** ColorCellC
// PROPS: - title
//        - onColorCompleteCbk( colorRGB )
export function ColorCellC( props ) {

  const [displayColorPicker, setDisplayColorPicker] = React.useState( false );
  const [color, setColor] = React.useState( props.color );
  /* r: '241',
   * g: '112',
   * b: '19',
   * a: '1',
     } ); */
  console.log( "ColorCellC.creation color=", color );
  
  const handleClick = () => {
    //this.setState({ displayColorPicker: !this.state.displayColorPicker })
    setDisplayColorPicker( displayColorPicker => !displayColorPicker );
  };

  const handleClose = () => {
    setDisplayColorPicker( false );
  };

  const handleChange = (color) => {
    console.log( "ColorCellC.handleChange color=", color );
    setColor( color.rgb );
    props.onColorCompleteCbk( color.rgb );
  };

  const styles = reactCSS( {
    'default' : {
      color: {
        background: `rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`,
      },
    }
  });
  
  //render
  return (
    <tr>
      <td><label>{props.title} : </label></td>
      <td>
        <div className="swatch" onClick={handleClick}>
          <div className="color_patch" style={styles.color} />
        </div>
        { displayColorPicker ?
          <div className="color_popover">
            <div className="color_cover" onClick={handleClose}/>
            <SwatchesPicker
              color={color}
              onChangeComplete={handleChange}
            />
          </div> : null }
      </td>
    </tr>
  );
}
// ************************************************************ END - ColorCellC
