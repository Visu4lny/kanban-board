import uuid from "react-uuid";
import { TodoList } from "../interfaces/interfaces";

const initialTodoList: TodoList = {
  listItems: [
    {
      id: uuid(),
      value: "Test1",
      isFinished: false,
      date: "",
    },
    {
      id: uuid(),
      value: "Test2",
      isFinished: true,
      date: "",
    },
    {
      id: uuid(),
      value: "Test3",
      isFinished: false,
      date: "12/2/2023",
    },
  ],
};

export default initialTodoList;
