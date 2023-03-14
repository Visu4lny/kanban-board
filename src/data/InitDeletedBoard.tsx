import uuid from "react-uuid";
import { DeletedList } from "../interfaces/interfaces";

const initialDeletedBoard: DeletedList = {
  listItems: [
    {
      id: uuid(),
      value: 'Test 2 deleted',
      deletedDate: '15/2/2023 | 11:12:20'
    }
  ]
};

export default initialDeletedBoard;