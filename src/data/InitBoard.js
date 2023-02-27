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
          date: '14/2/2023'
        },
        {
          id: uuid(),
          value: 'Test2',
          date: ''
        },
        {
          id: uuid(),
          value: 'Test3',
          date: ''
        },
      ]
    },
    {
      id: uuid(),
      title: 'IN PROGRESS',
      cards: [
        {
          id: uuid(),
          value: 'Test4',
          date: ''
        },
        {
          id: uuid(),
          value: 'Test5',
          date: ''
        }
      ]
    },
    {
      id: uuid(),
      title: 'DONE',
      cards: [
        {
          id: uuid(),
          value: 'Test6',
          date: ''
        },
        {
          id: uuid(),
          value: 'Test7',
          date: ''
        },
      ]
    }
  ]
 }

export default initialBoard;
