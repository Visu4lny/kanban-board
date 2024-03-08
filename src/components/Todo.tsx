import React from "react";
import uuid from "react-uuid";
import TodoItem from "./TodoItem";
// @ts-ignore
import statusIconDefault from "../img/circle-regular.svg";
// @ts-ignore
import statusIconDone from "../img/circle-check-solid.svg";
import { Task } from "../interfaces/interfaces";

type TodoProps = {
  list: Task[];
  showPrompt: (text: string, action: string, index?: number) => void;
  //  handleSwitchItemStatus: (index: number) => void,
  handleDeleteTodoItem: (index: number) => void;
};

export default function Todo(props: TodoProps) {
  const items = props.list.map((item, index) => {
    const itemId: string = uuid();
    let itemClass: string = item.finished
      ? "todoItem todoItemFinished"
      : "todoItem";
    let statusIcon: string = item.finished ? statusIconDone : statusIconDefault;

    return (
      <TodoItem
        key={itemId}
        text={item.value}
        index={index}
        itemClass={itemClass}
        statusIcon={statusIcon}
        date={item.date}
        handleDeleteTodoItem={props.handleDeleteTodoItem}
        showPrompt={props.showPrompt}
      />
    );
  });

  return (
    <div className="todo">
      <h2>TO DO:</h2>
      <div className="todo--todoItemWrapper">{items}</div>
      <div className="todo--addButton">
        <button
          onClick={() => props.showPrompt("New todo item:", "addTodoItem")}
        >
          Add new task
        </button>
      </div>
    </div>
  );
}
