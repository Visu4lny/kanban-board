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

  const commands = [
    {
      command: 'add *',
      callback: (tileText) => addTile(tileText)
    },
    {
      command: 'clear',
      callback: ({ resetTranscript }) => resetTranscript()
    }
  ]

  function addTile(text) {
    console.log(text)
    setBoard(prevBoard => {
      const newBoard = {...prevBoard};
      const tileValue = text;
      newBoard.columns[0].cards.push({
        id: uuid(),
        value: tileValue
      });
      return newBoard;
    });
  }

  const [board, setBoard] = useState(initialBoard)

  
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  const [voiceOn, setVoiceOn] = useState(false);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  function handleAddTile() {
    SpeechRecognition.startListening();
  }


  const listen = () => {
    SpeechRecognition.startListening({ continuous: true })
    setVoiceOn(true)
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
    setVoiceOn(false)
  }

  return (
    <div className="App">
      <Board key={uuid()} layout={board} handleAddTile={handleAddTile} />
      <div>
        <p>Microphone: {voiceOn ? 'on' : 'off'}</p>
        <p>{transcript}</p>
    </div>
    </div>
  );
}

// export default App;
