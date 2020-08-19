import React, { Component } from "react";

// *****************************************************************************
// *********************************************************************** MenuC
// PROPS: items = [ {label, cbk] OR {label:"<hr>", cbk:null} for sep ]
//        undisplayCbk
export function MenuC(props) {

  // build menu Items
  const listItems = props.items.map( (item, index) => {
    if (item.label === "<hr>") {
      return(<hr key={index}/>);
    }
    return (
      <span
        key={index}
        onClick={() =>  {
          //removeContextElementC();
          props.undisplayCbk();
          item.cbk( props.pos, null )
        }}
      >
        {item.label}
      </span>
    );
  });

  // render
  return (
  <div className="vertical_menu">
    {listItems}
    </div>
  );
};
export function createContextMenuC( posV, elemIDX, msg,
                                    menuItems, undisplayCbk ) {
  return (
    <MenuC
      elemIDX={elemIDX}
      pos={posV}
      msg={msg}
      items={menuItems}
      undisplayCbk={undisplayCbk}
    /> );
}
// ***************************************************************** END - MenuC
