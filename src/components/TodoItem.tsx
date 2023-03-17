import React from "react";
// @ts-ignore  
import editBtn from "../img/pen-to-square-solid.svg";
// @ts-ignore  
import removeBtn from "../img/trash-can-regular.svg";
// @ts-ignore  
import calendarBtn from "../img/calendar-days-solid.svg";

type TodoItemProps = {
  key: string,
  index: number,
  text: string,
  date: string,
  statusIcon: string,
  itemClass: string,
  handleSwitchItemStatus: (index: number) => void,
  handleDeleteTodoItem: (index: number) => void,
  showPrompt: (text: string, action: string, index?: number) => void
};

export default function TodoItem(props: TodoItemProps) {

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
        <img src={editBtn} alt="Edit" onClick={() => props.showPrompt("Edit: ", "editTodoItem", props.index)}/>
        <img src={removeBtn} alt="Remove" onClick={() => props.handleDeleteTodoItem(props.index)}/>
      </div>
    </div>
  );
};
