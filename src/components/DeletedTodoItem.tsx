import React from "react";

type DeletedTodoItemProps = {
  text: string;
  date: string;
  statusIcon: string;
};

export default function DeletedTodoItem(props: DeletedTodoItemProps) {
  return (
    <div className="deletedTodoItem">
      <img src={props.statusIcon} alt="status" />
      <p>{props.text}</p>
      <span>{props.date}</span>
    </div>
  );
}
