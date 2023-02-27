import React from "react";

export default function DeletedTodoItem(props) {
  return (
    <div className="deletedTodoItem">
      <img src={props.statusIcon} alt="status" />
      <p>{props.text}</p>
      <span>{props.date}</span>
    </div>
  )
}