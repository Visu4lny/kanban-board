import React from "react";
import uuid from "react-uuid";
import DeletedTodoItem from "./DeletedTodoItem";
import statusIconDeleted from "../img/circle-minus-solid.svg"

export default function DeletedTodo(props) {

  const items = props.list.listItems.map((item) => {
    const itemId = uuid();
    return (
      <DeletedTodoItem key={itemId} text={item.value} date={item.deletedDate} statusIcon={statusIconDeleted} />
    )
  })

  return (
    <div className="deletedTodo">
      <h2>Deleted Items:</h2>
      <div className="todo--asd">{items}</div>
    </div>
  )
}