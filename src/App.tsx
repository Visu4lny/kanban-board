import { useEffect, useState } from "react";
import uuid from "react-uuid";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css";
import Navbar from "./components/Navbar";
import Todo from "./components/Todo";
import DeletedTodo from "./components/DeletedTodo";
import Board from "./components/Board";
import Prompt from "./components/Prompt";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import initialBoard from "./data/InitBoard";
import initialTodoList from "./data/InitTodoList";
import initialDeletedTodoList from "./data/InitDeletedTodoList";
import initialDeletedBoard from "./data/InitDeletedBoard";
import React from "react";
import CSS from 'csstype';
import { KanbanBoard, DeletedList, TodoList, Command } from "./interfaces/interfaces";



export default function App() {

  type commands = Array<Command>;
  
  const kanbanCommands: commands = [
    {
      command: 'to do *',
      callback: (tileText) => addTile(tileText)
    },
    {
      command: 'move number :tileNumber from * to *',
      callback: (tileNumber, columnFrom, columnTo) => moveTile(tileNumber, columnFrom, columnTo)
    },
    {
      command: 'delete number :tileNumber from *',
      callback: (tileNumber, column) => deleteTile(tileNumber, column)
    },
    {
      command: 'edit number :tileNumber from * to *',
      callback: (tileNumber, column, newValue) => editTile(tileNumber, column, newValue)
    },
    {
      command: 'switch to *',
      callback: (moduleName) => switchModule(moduleName)
    }
  ];  
  
  const todoCommands: commands = [
    {
      command: 'to do *',
      callback: (text) => addTodoItem(text)
    },
    {
      command: 'check number :todoNumber',
      callback: (todoNumber) => checkNumber(todoNumber)
    },
    {
      command: 'uncheck number :todoNumber',
      callback: (todoNumber) => unCheckNumber(todoNumber)
    },
    {
      command: 'delete number :itemNumber',
      callback: (itemNumber) => deleteListItem(itemNumber)
    },
    {
      command: 'edit number :tileNumber to *',
      callback: (tileNumber, newValue) => editListItem(tileNumber, newValue)
    },
    {
      command: 'switch to *',
      callback: (moduleName) => switchModule(moduleName)
    }
  ];

  const initialNavStyle: Array<CSS.Properties> = [
    {
      width: "200px",
      height: "50px",
      color: "#A5A5A5",
      backgroundColor: "#1F273D",
      border: "none",
      borderRadius: "5px",
      fontSize: "1.2em"
    },
    {
      width: "200px",
      height: "50px",
      color: "#A5A5A5",
      backgroundColor: "#1F273D",
      border: "none",
      borderRadius: "5px",
      fontSize: "1.2em"
    }
  ];
  
  const [commands, setCommands] = useState<commands>(todoCommands);
  const [navStyle, setNavStyle] = useState<Array<CSS.Properties>>(initialNavStyle);
  const [board, setBoard] = useState<KanbanBoard>(initialBoard);
  const [deletedBoard, setDeletedBoard] = useState<DeletedList>(initialDeletedBoard);
  const [todoList, setTodoList] = useState<TodoList>(initialTodoList);
  const [deletedTodoList, setDeletedTodoList] = useState<DeletedList>(initialDeletedTodoList);
  const [module, setModule] = useState<string>("kanban");
  const {transcript} = useSpeechRecognition({commands});
  const [voiceOn, setVoiceOn] = useState(false);
  const [deletedSectionShown, setDeletedSectionShown] = useState<boolean>(false);
  const [deletedSection, setDeletedSection] = useState<JSX.Element>();
  const [prompt, setPrompt] = useState<JSX.Element>();
  const [promptShown, setPromptShown] = useState<boolean>(false);
  
  const boardColumns: string[] = ["to do", "in progress", "done"];
  const numberFormatter: string[] = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

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

  function addTodoItem(text: string) {
    setTodoList(prevTodoList => {
      const newTodoList = {...prevTodoList};
      const itemValue = text;
      newTodoList.listItems.push({
        id: uuid(),
        value: itemValue,
        isFinished: false,
        date: ""
      });
      stopListening();
      return newTodoList;
    })
  }

  function checkNumber(number: string) {
    let intNumber: number = formatNumber(number);
    setTodoList(prevTodoList => {
      const newTodoList = {...prevTodoList};
      newTodoList.listItems[intNumber].isFinished = true;
      stopListening();
      return newTodoList;
    })
  }

  function unCheckNumber(number: string) {
    let intNumber: number = formatNumber(number);
    setTodoList(prevTodoList => {
      const newTodoList = {...prevTodoList};
      newTodoList.listItems[intNumber].isFinished = false;
      stopListening();
      return newTodoList;
    })
  }

  function editListItem(number: string, value: string) {
    let intNumber: number = formatNumber(number);
    setTodoList(prevTodoList => {
      const newTodoList = {...prevTodoList};
      const newItem = {
        id: uuid(),
        value: value,
        isFinished: false,
        date: ""
      }
      newTodoList.listItems.splice(intNumber, 1, newItem);
      stopListening();
      return newTodoList;
    })
  }

  function deleteListItem(number: string) {
    let intNumber: number = formatNumber(number);
    setTodoList(prevTodoList => {
      const newTodoList = {...prevTodoList};
      newTodoList.listItems.splice(intNumber, 1);
      stopListening();
      return newTodoList;
    })
  }

  function addTile(text: string) {
    setBoard(prevBoard => {
      const newBoard: KanbanBoard = {...prevBoard};
      const tileValue: string = text;
      newBoard.columns[0].cards.push({
        id: uuid(),
        value: tileValue,
        date: ""
      });
      stopListening();
      return newBoard;
    });
  }

  function moveTile(number: string, columnFrom: string, columnTo: string) {
    let intNumber: number = formatNumber(number);
    const columnFromIndex: number = boardColumns.indexOf(columnFrom);
    const columnToIndex: number = boardColumns.indexOf(columnTo);

    if (columnFromIndex !== -1 && columnToIndex !== -1 && board.columns[columnFromIndex].cards.length >= intNumber) {
      try {
        setBoard(prevBoard => {
          const newBoard: KanbanBoard = {...prevBoard};
          const [removed] = newBoard.columns[columnFromIndex].cards.splice(intNumber, 1);
          newBoard.columns[columnToIndex].cards.push(removed);
          stopListening();
          return newBoard;
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  function deleteTile(number: string, column: string) {
    let intNumber: number = formatNumber(number);
    const columnIndex: number = boardColumns.indexOf(column);
    if (columnIndex !== -1) {
      setBoard(prevBoard => {
        const newBoard: KanbanBoard = {...prevBoard};
        newBoard.columns[columnIndex].cards.splice(intNumber, 1);
        stopListening();
        return newBoard;
      })
    }
  }

  function editTile(number: string, column: string, value: string) {
    let intNumber: number = formatNumber(number);
    const columnIndex = boardColumns.indexOf(column);
    if (columnIndex !== -1 && board.columns[columnIndex].cards[intNumber]) {
      setBoard(prevBoard => {
        const newBoard: KanbanBoard = {...prevBoard};
        const newTile = {
          id: uuid(),
          value: value,
          date: ""
        }
        newBoard.columns[columnIndex].cards.splice(intNumber, 1, newTile);
        stopListening();
        return newBoard;
      })
    }
  }

  function switchModule(moduleName: string) {
    moduleName = moduleName.replace(' ', '');
    if (moduleName === "to do" || moduleName === "do") {
      moduleName = "todo";
    }
    stopListening();
    setModule(moduleName);
  }
  
  function handleAddTile() {
    // const newTileValue = prompt("Enter new tile: ");
    // const newTile = {
    //   id: uuid(),
    //   value: newTileValue,
    //   date: ""
    // };
    // const newBoard = {...board};
    // newBoard.columns[0].cards.push(newTile);
    // setBoard(newBoard);
  }
  
  function handleAddTodoItem(value: string) {
    const newItem = {
      id: uuid(),
      value: value,
      isFinished: false,
      date: ""
    };
    const newTodoList = {...todoList};
    newTodoList.listItems.push(newItem);
    setTodoList(newTodoList);
  }

  function handlePromptSubmit(action: string, value: string) {
    switch (action) {
      case "addTodoItem":
        handleAddTodoItem(value);
        break;
    
      case "editTodoItem":
        // TODO fill in
        break;

      default:
        break;
    }
  }
 
  function handleCancelPromptSubmit() {
    setPromptShown(false);
  }

  function handleShowPrompt(text: string, action: string) {
    setPrompt((
      <Prompt text={text} action={action} submit={handlePromptSubmit} cancelSubmit={handleCancelPromptSubmit}/>
    ));
    setPromptShown(true);
  }

  function handleListen() {
    SpeechRecognition.startListening();
    listen();
  }

  function currentDate() {
    const date = new Date();
    const [day, month, year] = [
      date.getDate(),
      date.getMonth()+1,
      date.getFullYear()
    ];
    const [hour, minutes, seconds] = [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ];

    console.log(month)
    return day + "/" + month + "/" + year + " | " + hour + ":" + minutes + ":" + seconds;
  }
  
  function handleDeleteTodoItem(index: number) {
    const newTodoList = {...todoList};
    const deletedItem = newTodoList.listItems.splice(index, 1);
    const today = currentDate()
    const newDeletedItem = {
      id: uuid(),
      value: deletedItem[0].value,
      deletedDate: today
    };
    setDeletedTodoList(prevDeletedTodoList => {
      const newDeltedTodoList = {...prevDeletedTodoList};
      newDeltedTodoList.listItems.unshift(newDeletedItem);
      return newDeltedTodoList;
    })
    setTodoList(newTodoList)
  }
  
  function handleEditTodoItem(index: number) {
    // const newTodoItemValue = prompt("Enter new text: ");
    // const newItem = {
    //   id: uuid(),
    //   value: newTodoItemValue,
    //   isFinished: false,
    //   date: ""
    // }
    // const newTodoList = {...todoList};
    // newTodoList.listItems.splice(index, 1, newItem);
    // setTodoList(newTodoList);
  }
  
  function handleDeleteTile(index: number, columnIndex: number) {
    const newBoard: KanbanBoard = {...board};
    newBoard.columns[columnIndex].cards.splice(index, 1);
    setBoard(newBoard);
  }
  
  function handleEditTile(index: number, columnIndex: number) {
    // const newTileValue = prompt("Enter new text: ")
    // const newTile = {
    //   id: uuid(),
    //   value: newTileValue
    // }
    // const newBoard = {...board};
    // newBoard.columns[columnIndex].cards.splice(index, 1, newTile);
    // setBoard(newBoard);
  }
  
  function handleSwitchModule(moduleClicked: string) {
    if (module !== moduleClicked) {
      setModule(moduleClicked);
      console.log("different!")
    }
    console.log(module)
  };
  
  function handleSwitchItemStatus(index: number) {
    try {
      setTodoList(prevTodoList => {
        const newTodoList = {...prevTodoList};
        const isFinishedValue = newTodoList.listItems[index].isFinished;
        newTodoList.listItems[index].isFinished = !isFinishedValue;
        return newTodoList;
      })
    } catch (error) {
      console.log(error);
    }
  }
  
  const [activeModule, setActiveModule] = useState<JSX.Element>(<Todo
    key={uuid()}
    list={todoList}
    showPrompt={handleShowPrompt}
    handleDeleteTodoItem={handleDeleteTodoItem}
    handleEditTodoItem={handleEditTodoItem}
    handleSwitchItemStatus={handleSwitchItemStatus}
    />
  );
  
  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.log("Browser doesn't support speech recognition.");
    }

    const localBoard: KanbanBoard = JSON.parse(localStorage.getItem('board'));
    if (localBoard) {
      setBoard(localBoard);
    } 

    const localTodoList = JSON.parse(localStorage.getItem('todoList'));
    if (localTodoList) {
      setTodoList(localTodoList);
    }
  }, [])

  useEffect(() => {
    if (module === "todo") {
      localStorage.setItem('todoList', JSON.stringify(todoList));
      setActiveModule(() => (
        <Todo
          key={uuid()} 
          list={todoList}
          showPrompt={handleShowPrompt}
          handleDeleteTodoItem={handleDeleteTodoItem}
          handleEditTodoItem={handleEditTodoItem}
          handleSwitchItemStatus={handleSwitchItemStatus}
        />
      ));
      setDeletedSection(() => (
        <DeletedTodo list={deletedTodoList}/>
      ));
      setCommands(todoCommands);
      setNavStyle(prevNavStyle => {
        const newNavStyle = [
          {
            width: "200px",
            height: "50px",
            color: "#FFFFFF",
            backgroundColor: "#445493",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.2em"
          },
          {
            width: "200px",
            height: "50px",
            color: "#A5A5A5",
            backgroundColor: "#1F273D",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.2em"
          }
        ];
        return newNavStyle;
      })
    } else {
      localStorage.setItem('board', JSON.stringify(board));

      setActiveModule(() =>(
        <DragDropContext onDragEnd={onDragEnd}>
          <Board
            key={uuid()}
            layout={board}
            handleAddTile={handleAddTile}
            handleDeleteTile={handleDeleteTile}
            handleEditTile={handleEditTile}
          />
        </DragDropContext>
      ));
      setDeletedSection(() => (
        <DeletedTodo list={deletedBoard}/>
      ));
      setCommands(kanbanCommands);
      setNavStyle(prevNavStyle => {
        const newNavStyle = [
          {
            width: "200px",
            height: "50px",
            color: "#A5A5A5",
            backgroundColor: "#1F273D",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.2em"
          },
          {
            width: "200px",
            height: "50px",
            color: "#FFFFFF",
            backgroundColor: "#445493",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.2em"
          }
        ];
        return newNavStyle
      })
    }
  }, [module, board, todoList]);

  const listen = () => {
    SpeechRecognition.startListening({ continuous: true })
    setVoiceOn(true)
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
    setVoiceOn(false)
  }

  function reorder(currentBoard: KanbanBoard, sourceId: string, sourceIndex: number, destinationId: string, destinationIndex: number) {
    const result = {...currentBoard};
    let sourceIdInt: number = parseInt(sourceId);
    let destinationIdInt: number = parseInt(destinationId);
    const [removed] = result.columns[sourceIdInt].cards.splice(sourceIndex, 1);
    result.columns[destinationIdInt].cards.splice(destinationIndex, 0, removed);
    return result;
  }

  function onDragEnd(result:DropResult) {
    if (!result.destination) {
      return;
    } else {
      const newBoard: KanbanBoard = reorder(
        board,
        result.source.droppableId,
        result.source.index,
        result.destination.droppableId,
        result.destination.index
      );
      setBoard(newBoard);
    }
  }

  return (
    <div className="App">
      <Navbar currentModule={module} handleSwitchModule={handleSwitchModule} navStyle={navStyle} />
      {/* promptShown && <Prompt text={"New text:"} action={"addTodoItem"}  submit={handlePromptSubmit} cancelSubmit={handleCancelPromptSubmit}/> */}
      {/* promptShown && prompt */}
      {activeModule}
      <div className="microphone">
        <button className="actionButton" onClick={handleListen}>Listen</button>
        <p>Microphone: {voiceOn ? 'on' : 'off'}</p>
        <p>{transcript}</p>
      </div>
      <button
        className="actionButton deletedItemsButton"
        onClick={() => setDeletedSectionShown(prevValue => !prevValue)}
      >
        {deletedSectionShown ? "Hide" : "Show"} Deleted Items
      </button>
      {deletedSectionShown && 
        <div className="deletedItemsWrapper">
          {/* <DeletedTodo list={deletedTodoList}/> */}
          {deletedSection}
        </div>
      }
    </div>
  );
}
