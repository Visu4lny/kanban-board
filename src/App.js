import { useEffect, useState } from 'react';
import uuid from 'react-uuid';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';
import Board from './components/Board';
import { DragDropContext } from 'react-beautiful-dnd';

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
      command: 'to do *',
      callback: (tileText) => addTile(tileText)
    },
    {
      command: 'move number *',
      callback: (moveCommand) => moveTile(moveCommand)
    },
    {
      command: 'clear',
      callback: ({ resetTranscript }) => resetTranscript()
    }
  ]

  function addTile(text) {
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

  function moveTile(moveCommand) {
    const firstSplit = moveCommand.split(" from ");
    const secondSplit = firstSplit[1].split(" to ");
    const command = [];
    command.push(firstSplit[0]);
    command.push(secondSplit[0]);
    command.push(secondSplit[1]);
    console.log(command)
  }

  const [board, setBoard] = useState(initialBoard)

  
  const {transcript, resetTranscript} = useSpeechRecognition({ commands });

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

  function reorder(currentBoard, sourceId, sourceIndex, destinationId, destinationIndex) {
    const result = {...currentBoard};
    sourceId = parseInt(sourceId);
    destinationId = parseInt(destinationId);
    const [removed] = result.columns[sourceId].cards.splice(sourceIndex, 1);
    result.columns[destinationId].cards.splice(destinationIndex, 0, removed);

    return result;
  }

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    } else {
      const newBoard = reorder(
        board,
        result.source.droppableId,
        result.source.index,
        result.destination.droppableId,
        result.destination.index
      )
      setBoard(newBoard)
    }
  }

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <Board key={uuid()} layout={board} handleAddTile={handleAddTile} />
      </DragDropContext>
      <div>
        <p>Microphone: {voiceOn ? 'on' : 'off'}</p>
        <p>{transcript}</p>
    </div>
    </div>
  );
}

// export default App;
