import uuid from 'react-uuid';

const initialBoard = {
  columns: [
    {
      id: uuid(),
      title: 'TO DO',
      cards: [
        {
          id: uuid(),
          value: 'Test1',
        },
        {
          id: uuid(),
          value: 'Test2',
        },
        {
          id: uuid(),
          value: 'Test3'
        },
      ]
    },
    {
      id: uuid(),
      title: 'IN PROGRESS',
      cards: [
        {
          id: uuid(),
          value: 'Test4'
        },
        {
          id: uuid(),
          value: 'Test5'
        }
      ]
    },
    {
      id: uuid(),
      title: 'DONE',
      cards: [
        {
          id: uuid(),
          value: 'Test6'
        },
        {
          id: uuid(),
          value: 'Test7'
        },
      ]
    }
  ]
 }

export default initialBoard;
