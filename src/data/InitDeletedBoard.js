import uuid from "react-uuid";

const initialDeletedBoard = {
  listItems: [
    {
      id: uuid(),
      value: 'Test 2 deleted',
      deletedDate: '15/2/2023 | 11:12:20'
    }
  ]
}

export default initialDeletedBoard;