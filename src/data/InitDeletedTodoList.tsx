import uuid from "react-uuid";
import { DeletedList } from "../interfaces/interfaces";

const initialDeletedTodoList: DeletedList = {
  listItems: [
    {
      id: uuid(),
      value: "Test 1 deleted",
      deletedDate: "3/2/2023 | 14:35:21",
    },
  ],
};

export default initialDeletedTodoList;
