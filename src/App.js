import { useEffect, useState } from "react";
import uuid from "react-uuid";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css";
import Navbar from "./components/Navbar";
import Todo from "./components/Todo";
import DeletedTodo from "./components/DeletedTodo";
import Board from "./components/Board";
import Prompt from "./components/Prompt";
import { DragDropContext } from "react-beautiful-dnd";
import initialBoard from "./data/InitBoard";
import initialTodoList from "./data/InitTodoList";
import initialDeletedTodoList from "./data/InitDeletedTodoList";
import initialDeletedBoard from "./data/InitDeletedBoard";

export default function App() {
  
  
  
  const kanbanCommands = [
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
    },
    {
      command: 'clear',
      callback: ({ resetTranscript }) => resetTranscript()
    }
  ];
  
  const todoCommands = [
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
    },
    {
      command: 'clear',
      callback: ({ resetTranscript }) => resetTranscript()
    }
  ];

  const initialNavStyle = [
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
  
  const [commands, setCommands] = useState(todoCommands);
  const [navStyle, setNavStyle] = useState(initialNavStyle);
  const [board, setBoard] = useState(initialBoard);
  const [deletedBoard, setDeletedBoard] = useState(initialDeletedBoard);
  const [todoList, setTodoList] = useState(initialTodoList);
  const [deletedTodoList, setDeletedTodoList] = useState(initialDeletedTodoList);
  const [module, setModule] = useState("todo");
  const {transcript} = useSpeechRecognition({ commands });
  const [voiceOn, setVoiceOn] = useState(false);
  const [deletedSectionShown, setDeletedSectionShown] = useState(false);
  const [deletedSection, setDeletedSection] = useState("");
  
  const boardColumns = ["to do", "in progress", "done"];
  const numberFormatter = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

  function formatNumber(number) {
    if (number === "0") {
      number = 0;
    } else if (parseInt(number)) {
      number = parseInt(number);
    } else {
      number = numberFormatter.indexOf(number);
    }
    return number;
  }

  function addTodoItem(text) {
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

  function checkNumber(number) {
    number = formatNumber(number);
    setTodoList(prevTodoList => {
      const newTodoList = {...prevTodoList};
      newTodoList.listItems[number].isFinished = true;
      stopListening();
      return newTodoList;
    })
  }

  function unCheckNumber(number) {
    number = formatNumber(number);
    setTodoList(prevTodoList => {
      const newTodoList = {...prevTodoList};
      newTodoList.listItems[number].isFinished = false;
      stopListening();
      return newTodoList;
    })
  }

  function editListItem(number, value) {
    number = formatNumber(number);
    setTodoList(prevTodoList => {
      const newTodoList = {...prevTodoList};
      const newItem = {
        id: uuid(),
        value: value,
        isFinished: false,
        date: ""
      }
      newTodoList.listItems.splice(number, 1, newItem);
      stopListening();
      return newTodoList;
    })
  }

  function deleteListItem(number) {
    number = formatNumber(number);
    setTodoList(prevTodoList => {
      const newTodoList = {...prevTodoList};
      newTodoList.listItems.splice(number, 1);
      stopListening();
      return newTodoList;
    })
  }

  function addTile(text) {
    setBoard(prevBoard => {
      const newBoard = {...prevBoard};
      const tileValue = text;
      newBoard.columns[0].cards.push({
        id: uuid(),
        value: tileValue,
        date: ""
      });
      stopListening();
      return newBoard;
    });
  }

  function moveTile(number, columnFrom, columnTo) {
    number = formatNumber(number);

    const columnFromIndex = boardColumns.indexOf(columnFrom);
    const columnToIndex = boardColumns.indexOf(columnTo);

    if (columnFromIndex !== -1 && columnToIndex !== -1 && board.columns[columnFromIndex].cards.length >= number) {
      try {
        setBoard(prevBoard => {
          const newBoard = {...prevBoard};
          const [removed] = newBoard.columns[columnFromIndex].cards.splice(number, 1);
          newBoard.columns[columnToIndex].cards.push(removed);
          stopListening();
          return newBoard;
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  function deleteTile(number, column) {
    number = formatNumber(number);
    const columnIndex = boardColumns.indexOf(column);
    if (columnIndex !== -1) {
      setBoard(prevBoard => {
        const newBoard = {...prevBoard};
        newBoard.columns[columnIndex].cards.splice(number, 1);
        stopListening();
        return newBoard;
      })
    }
  }

  function editTile(number, column, value) {
    number = formatNumber(number);
    const columnIndex = boardColumns.indexOf(column);
    if (columnIndex !== -1 && board.columns[columnIndex].cards[number]) {
      setBoard(prevBoard => {
        const newBoard = {...prevBoard};
        const newTile = {
          id: uuid(),
          value: value,
          date: ""
        }
        newBoard.columns[columnIndex].cards.splice(number, 1, newTile);
        stopListening();
        return newBoard;
      })
    }
  }

  function switchModule(moduleName) {
    moduleName = moduleName.replace(' ', '');
    if (moduleName === "to do" || moduleName === "do") {
      moduleName = "todo";
    }
    stopListening();
    setModule(moduleName);
  }
  
  function handleAddTile() {
    const newTileValue = prompt("Enter new tile: ");
    const newTile = {
      id: uuid(),
      value: newTileValue,
      date: ""
    };
    const newBoard = {...board};
    newBoard.columns[0].cards.push(newTile);
    setBoard(newBoard);
  }

  const [prompt, setPrompt] = useState();
  
  const [promptShown, setPromptShown] = useState(false);
  
  function handleAddTodoItem(value) {
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

  function handlePromptSubmit(action, value) {
    switch (action) {
      case "addTodoItem":
        handleAddTodoItem(value);
        break;
    
      case "editTodoItem":

        break;

      default:
        break;
    }
  }
 
  function handleCancelPromptSubmit() {
    setPromptShown(false);
  }

  function handleShowPrompt(text, action) {
    setPrompt((
      <Prompt text={text} action={action}  submit={handlePromptSubmit} cancelSubmit={handleCancelPromptSubmit}/>
    ))
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
  
  function handleDeleteTodoItem(index) {
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
  
  function handleEditTodoItem(index) {
    const newTodoItemValue = prompt("Enter new text: ");
    const newItem = {
      id: uuid(),
      value: newTodoItemValue,
      isFinished: false,
      date: ""
    }
    const newTodoList = {...todoList};
    newTodoList.listItems.splice(index, 1, newItem);
    setTodoList(newTodoList);
  }
  
  function handleDeleteTile(index, columnIndex) {
    const newBoard = {...board};
    newBoard.columns[columnIndex].cards.splice(index, 1);
    setBoard(newBoard);
  }
  
  function handleEditTile(index, columnIndex) {
    const newTileValue = prompt("Enter new text: ")
    const newTile = {
      id: uuid(),
      value: newTileValue
    }
    const newBoard = {...board};
    newBoard.columns[columnIndex].cards.splice(index, 1, newTile);
    setBoard(newBoard);
  }
  
  function handleSwitchModule(moduleClicked) {
    if (module !== moduleClicked) {
      setModule(moduleClicked);
      console.log("different!")
    }
    console.log(module)
  };
  
  function handleSwitchItemStatus(index) {
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

  
  const [activeModule, setActiveModule] = useState(() => {
    <Todo
    key={uuid()}
    list={todoList}
    showPrompt={handleShowPrompt}
    handleDeleteTodoItem={handleDeleteTodoItem}
    handleEditTodoItem={handleEditTodoItem}
    handleSwitchItemStatus={handleSwitchItemStatus}
    />
  });
  
  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Browser doesn't support speech recognition.");
    }

    const localBoard = JSON.parse(localStorage.getItem('board'));
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
      <Navbar currentModule={module} handleSwitchModule={handleSwitchModule} navStyle={navStyle} />
      {/* promptShown && <Prompt text={"New text:"} action={"addTodoItem"}  submit={handlePromptSubmit} cancelSubmit={handleCancelPromptSubmit}/> */}
      {promptShown && prompt}
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
