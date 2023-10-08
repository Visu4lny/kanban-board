import React from "react";
import { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Command } from "../interfaces/interfaces";

type VoiceInputProps = {
  addTodoItem: (value: string) => void;
  deleteTodoItem: (index: number) => void;
  editTodoItem: (value: string, index: number) => void;
  switchItemStatus: (index: number, action?: string) => void;
  addKanbanItem: (value: string) => void;
  deleteKanbanItem: (index: number, columnIndex: number) => void;
  editKanbanItem: (value: string, index: number, columnIndex: number) => void;
  switchModule: (moduleName: string) => void;
};

export default function VoiceInput(props: VoiceInputProps) {
  type Commands = Array<Command>;

  const kanbanCommands: Commands = [
    {
      command: "to do *",
      callback: (tileText) => addKanbanItem(tileText),
    },
    // {
    //   command: "move number :tileNumber from * to *",
    //   callback: (tileNumber, columnFrom, columnTo) =>
    //     moveKanbanItem(tileNumber, columnFrom, columnTo),
    // },
    {
      command: "delete number :tileNumber from *",
      callback: (tileNumber, column) => deleteKanbanItem(tileNumber, column),
    },
    {
      command: "edit number :tileNumber from * to *",
      callback: (tileNumber, column, newValue) =>
        editKanbanItem(tileNumber, column, newValue),
    },
    {
      command: "switch to *",
      callback: (moduleName) => switchModule(moduleName),
    },
  ];

  const todoCommands: Commands = [
    {
      command: "to do *",
      callback: (text) => addTodoItem(text),
    },
    {
      command: "check number :todoNumber",
      callback: (todoNumber) => checkTodoItem(todoNumber),
    },
    {
      command: "uncheck number :todoNumber",
      callback: (todoNumber) => unCheckTodoItem(todoNumber),
    },
    {
      command: "delete number :itemNumber",
      callback: (itemNumber) => deleteTodoItem(itemNumber),
    },
    {
      command: "edit number :tileNumber to *",
      callback: (tileNumber, newValue) => editTodoItem(tileNumber, newValue),
    },
    {
      command: "switch to *",
      callback: (moduleName) => switchModule(moduleName),
    },
  ];

  const [commands, setCommands] = useState<Commands>(todoCommands);
  const { transcript } = useSpeechRecognition({ commands });
  const [voiceOn, setVoiceOn] = useState(false);
  const numberFormatter: string[] = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const boardColumns: string[] = ["to do", "in progress", "done"];

  const listen = () => {
    SpeechRecognition.startListening({ continuous: true });
    setVoiceOn(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setVoiceOn(false);
  };

  function handleListen() {
    SpeechRecognition.startListening();
    listen();
  }

  function formatNumber(number: string) {
    let intNumber: number;
    if (number === "0") {
      intNumber = 0;
    } else if (parseInt(number)) {
      intNumber = parseInt(number);
    } else {
      intNumber = numberFormatter.indexOf(number);
    }
    return intNumber;
  }

  // Todo Module
  function addTodoItem(text: string) {
    stopListening();
    props.addTodoItem(text);
  }

  function deleteTodoItem(number: string) {
    stopListening();
    let intNumber: number = formatNumber(number);
    props.deleteTodoItem(intNumber);
  }

  function editTodoItem(number: string, value: string) {
    stopListening();
    let intNumber: number = formatNumber(number);
    props.editTodoItem(value, intNumber);
  }

  function checkTodoItem(number: string) {
    stopListening();
    let intNumber: number = formatNumber(number);
    props.switchItemStatus(intNumber, "check");
  }

  function unCheckTodoItem(number: string) {
    stopListening();
    let intNumber: number = formatNumber(number);
    props.switchItemStatus(intNumber, "uncheck");
  }

  // Kanban Module
  function addKanbanItem(text: string) {
    stopListening();
    props.addKanbanItem(text);
  }

  function deleteKanbanItem(number: string, column: string) {
    stopListening();
    let intNumber: number = formatNumber(number);
    const columnIndex: number = boardColumns.indexOf(column);
    if (columnIndex !== -1) {
      props.deleteKanbanItem(intNumber, columnIndex);
    }
  }

  function editKanbanItem(number: string, column: string, value: string) {
    stopListening();
    let intNumber: number = formatNumber(number);
    const columnIndex = boardColumns.indexOf(column);
    if (columnIndex !== -1) {
      props.editKanbanItem(value, intNumber, columnIndex);
    }
  }

  /*
  function moveTile(number: string, columnFrom: string, columnTo: string) {
    let intNumber: number = formatNumber(number);
    const columnFromIndex: number = boardColumns.indexOf(columnFrom);
    const columnToIndex: number = boardColumns.indexOf(columnTo);

    if (
      columnFromIndex !== -1 &&
      columnToIndex !== -1 &&
      board.columns[columnFromIndex].cards.length >= intNumber
    ) {
      try {
        setBoard((prevBoard) => {
          const newBoard: KanbanBoard = { ...prevBoard };
          const [removed] = newBoard.columns[columnFromIndex].cards.splice(
            intNumber,
            1
          );
          newBoard.columns[columnToIndex].cards.push(removed);
          stopListening();
          return newBoard;
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
  */

  function switchModule(moduleName: string) {
    stopListening();
    moduleName = moduleName.replace(" ", "");
    if (moduleName === "to do" || moduleName === "do") {
      moduleName = "todo";
    }
    props.switchModule(moduleName);
  }

  return (
    <div className="microphone">
      <button className="actionButton" onClick={handleListen}>
        Listen
      </button>
      <p>Microphone: {voiceOn ? "on" : "off"}</p>
      <p>{transcript}</p>
    </div>
  );
}
