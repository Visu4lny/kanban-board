import React from "react";
import uuid from "react-uuid";
import TodoItem from "./TodoItem";
// @ts-ignore  
import statusIconDefault from "../img/circle-regular.svg";
// @ts-ignore  
import statusIconDone from "../img/circle-check-solid.svg";
import {TodoList} from "../interfaces/interfaces";

type TodoProps = {
  list: TodoList,
  showPrompt: (text: string, action: string) => void,
  handleSwitchItemStatus: (index: number) => void,
  handleEditTodoItem: (index: number) => void,
  handleDeleteTodoItem: (index: number) => void
};

export default function Todo(props: TodoProps) {

  const items = props.list.listItems.map((item, index) => {
    const itemId: string = uuid();
    let itemClass: string = item.isFinished ? "todoItem todoItemFinished" : "todoItem";
    let statusIcon: string = item.isFinished ? statusIconDone : statusIconDefault;

    return (
        <TodoItem
          key ={itemId}
          text={item.value}
          index={index}
          itemClass={itemClass}
          statusIcon={statusIcon}
          date={item.date}
          handleSwitchItemStatus={props.handleSwitchItemStatus}
          handleDeleteTodoItem={props.handleDeleteTodoItem}
          handleEditTodoItem={props.handleEditTodoItem}
        />
    )
  });

  return (
    <div className="todo">
      <h2>TO DO:</h2>
      <div className="todo--todoItemWrapper">{items}</div>
      <div className="todo--addButton">
        <button onClick={() => props.showPrompt("New todo item:", "addTodoItem")}>Add new task</button>
      </div>
    </div>
  );
};
