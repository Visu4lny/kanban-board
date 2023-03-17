import React from "react";
// @ts-ignore  
import editBtn from "../img/pen-to-square-solid.svg";
// @ts-ignore  
import removeBtn from "../img/trash-can-regular.svg";
// @ts-ignore  
import calendarBtn from "../img/calendar-days-solid.svg";

type TileProps = {
  text: string,
  index: number,
  column: number,
  date: string,
  showPrompt: (text: string, action: string, index?: number, columnIndex?: number) => void,
  handleDeleteTile: (index: number, column: number) => void
};

export default function Tile(props: TileProps) {
  return (
    <div className="tile">
      <div className="tile--imageWrapper">
        <img src={calendarBtn} alt="Calendar" />
        <img src={editBtn} alt="Edit" onClick={() => props.showPrompt("Edit: ", "editTile", props.index, props.column)}/>
        <img src={removeBtn} alt="Remove" onClick={() => props.handleDeleteTile(props.index, props.column)}/>
      </div>
      <span className="tile--date">{props.date}</span>
      <span className="tile--index">#{props.index}</span>
      <p>{props.text}</p>
    </div>
  );
};
