import React, { useState } from "react";
import editBtn from "../img/pen-to-square-solid.svg"
import removeBtn from "../img/trash-can-regular.svg"
import calendarBtn from "../img/calendar-days-solid.svg"

export default function TodoItem(props) {
  const [date, setDate] = useState("");

  return (
    <div className={props.itemClass}>
      <div className="todoItemBody" onClick={() => props.handleSwitchItemStatus(props.index)}>
        <img src={props.statusIcon} alt="status"/>
        <span className="todoItem--index">#{props.index}</span>
        <p>{props.text}</p>
      </div>
      <span className="todoItem--date">{props.date}</span>
      <div className="todoItem--functionButtonsWrapper">
        <img src={calendarBtn} alt="Calendar" />
        <img src={editBtn} alt="Edit" onClick={() => props.handleEditTodoItem(props.index)}/>
        <img src={removeBtn} alt="Remove" onClick={() => props.handleDeleteTodoItem(props.index)}/>
      </div>
    </div>
  )
}
