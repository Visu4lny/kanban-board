import uuid from "react-uuid";

const initialDeletedTodoList = {
  listItems: [
    {
      id: uuid(),
      value: 'Test 1 deleted',
      deletedDate: '3/2/2023 | 14:35:21'
    }
  ]
}

export default initialDeletedTodoList;