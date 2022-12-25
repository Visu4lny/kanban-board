import { useState } from 'react';
import uuid from 'react-uuid';
import './App.css';
import Board from './components/Board';

export default function App() {
  const initialBoard = {
    columns: [
      {
        id: uuid(),
        title: 'TO DO',
        cards: [
          {
            id: uuid(),
            value: 'Test',
          },
          {
            id: uuid(),
            value: 'Test_1',
          },
          {
            id: uuid(),
            value: 'Test_2_asd UYKGASUDY iyu btadsASDASD JHASASDASD ASKH DUASHfGY OIASDFYUGKASDFFGUYIADSGFUYAGSDUF',
          },
        ]
      },
      {
        id: uuid(),
        title: 'IN PROGRESS',
        cards: [
        ]
      },
      {
        id: uuid(),
        title: 'DONE',
        cards: [
          {
            id: uuid(),
            value: 'Test3'
          },
        ]
      }
    ]
  }

  const [board, setBoard] = useState(initialBoard)

  function handleAddTile() {
    setBoard(prevBoard => { 
      const newBoard = {...prevBoard};
      const tileValue = prompt("Enter value:")
      newBoard.columns[0].cards.push({
        id: uuid(), 
        value: tileValue
      });
      return newBoard;
    })
  }

  return (
    <div className="App">
      <Board key={uuid()} layout={board} handleAddTile={handleAddTile} />
    </div>
  );
}

// export default App;
