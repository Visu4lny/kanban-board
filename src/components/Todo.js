import React from "react";
import uuid from "react-uuid";
import TodoItem from "./TodoItem";
import statusIconDefault from "../img/circle-regular.svg"
import statusIconDone from "../img/circle-check-solid.svg"


export default function  Todo(props) {

  const items = props.list.listItems.map((item, index) => {
    const itemId = uuid();
    let itemClass = item.isFinished ? "todoItem todoItemFinished" : "todoItem";
    let statusIcon = item.isFinished ? statusIconDone : statusIconDefault;
    let dateSet = item.date === "" ? false : true; 

    return (
        <TodoItem
          key={itemId}
          text={item.value}
          index={index}
          itemClass={itemClass}
          statusIcon={statusIcon}
          date={item.date}
          dateSet={dateSet}
          handleSwitchItemStatus={props.handleSwitchItemStatus}
          handleDeleteTodoItem={props.handleDeleteTodoItem}
          handleEditTodoItem={props.handleEditTodoItem}
          handleEditItem={props.handleEditItem}
        />
    )
  })

  return (
    <div className="todo">
      <h2>TO DO:</h2>
      <div className="todo--todoItemWrapper">{items}</div>
      <div className="todo--addButton">
        <button onClick={() => props.showPrompt("New todo item:", "addTodoItem")}>Add new task</button>
      </div>
    </div>
  )
}
