import React from "react";
import editBtn from "../img/pen-to-square-solid.svg"
import removeBtn from "../img/trash-can-regular.svg"
import calendarBtn from "../img/calendar-days-solid.svg"

export default function Tile(props) {
  return (
    <div className="tile">
      <div className="tile--imageWrapper">
        <img src={calendarBtn} alt="Calendar" />
        <img src={editBtn} alt="Edit" onClick={() => props.handleEditTile(props.index, props.column)}/>
        <img src={removeBtn} alt="Remove" onClick={() => props.handleDeleteTile(props.index, props.column)}/>
      </div>
      <span className="tile--date">{props.date}</span>
      <span className="tile--index">#{props.index}</span>
      <p>{props.text}</p>
    </div>
  )
}
