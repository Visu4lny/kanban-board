import { useEffect, useState } from 'react';
import uuid from 'react-uuid';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
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

  
  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect( () => {
    if (finalTranscript) {
      setBoard(prevBoard => {
        const newBoard = {...prevBoard};
        const tileValue = finalTranscript;
        newBoard.columns[0].cards.push({
          id: uuid(),
          value: tileValue
        });
        return newBoard;
      });
      resetTranscript();
    }
  },[finalTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  async function handleAddTile() {
    await SpeechRecognition.startListening();
  }

  return (
    <div className="App">
      <Board key={uuid()} layout={board} handleAddTile={handleAddTile} />
      <div>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <p>{transcript}</p>
    </div>
    </div>
  );
}

// export default App;
