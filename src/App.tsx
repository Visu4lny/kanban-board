import { useEffect, useState } from "react";
import uuid from "react-uuid";
import SpeechRecognition from "react-speech-recognition";
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
import CSS from "csstype";
import { KanbanBoard, DeletedList, TodoList } from "./interfaces/interfaces";
import VoiceInput from "./components/VoiceInput";

export default function App() {
  const initialNavStyle: Array<CSS.Properties> = [
    {
      width: "200px",
      height: "50px",
      color: "#A5A5A5",
      backgroundColor: "#1F273D",
      border: "none",
      borderRadius: "5px",
      fontSize: "1.2em",
    },
    {
      width: "200px",
      height: "50px",
      color: "#A5A5A5",
      backgroundColor: "#1F273D",
      border: "none",
      borderRadius: "5px",
      fontSize: "1.2em",
    },
  ];

  const [navStyle, setNavStyle] =
    useState<Array<CSS.Properties>>(initialNavStyle);
  const [board, setBoard] = useState<KanbanBoard>(initialBoard);
  const [deletedBoard, setDeletedBoard] =
    useState<DeletedList>(initialDeletedBoard);
  const [todoList, setTodoList] = useState<TodoList>(initialTodoList);
  const [deletedTodoList, setDeletedTodoList] = useState<DeletedList>(
    initialDeletedTodoList
  );
  const [module, setModule] = useState<string>("kanban");
  const [deletedSectionShown, setDeletedSectionShown] =
    useState<boolean>(false);
  const [deletedSection, setDeletedSection] = useState<JSX.Element>();
  const [prompt, setPrompt] = useState<JSX.Element>();
  const [promptShown, setPromptShown] = useState<boolean>(false);

  // TODO Module
  function handleAddTodoItem(value: string) {
    const newItem = {
      id: uuid(),
      value: value,
      isFinished: false,
      date: "",
    };
    const newTodoList = { ...todoList };
    newTodoList.listItems.push(newItem);
    setTodoList(newTodoList);
  }

  function handleDeleteTodoItem(index: number) {
    const newTodoList = { ...todoList };
    const deletedItem = newTodoList.listItems.splice(index, 1);
    const today = currentDate();
    const newDeletedItem = {
      id: uuid(),
      value: deletedItem[0].value,
      deletedDate: today,
    };
    setDeletedTodoList((prevDeletedTodoList) => {
      const newDeltedTodoList = { ...prevDeletedTodoList };
      newDeltedTodoList.listItems.unshift(newDeletedItem);
      return newDeltedTodoList;
    });
    setTodoList(newTodoList);
  }

  function handleEditTodoItem(value: string, index: number) {
    const newItem = {
      id: uuid(),
      value: value,
      isFinished: false,
      date: "",
    };
    const newTodoList = { ...todoList };
    newTodoList.listItems.splice(index, 1, newItem);
    setTodoList(newTodoList);
  }

  function handleSwitchTodoItemStatus(index: number, action?: string) {
    switch (action) {
      case "check":
        setTodoList((prevTodoList) => {
          const newTodoList = { ...prevTodoList };
          newTodoList.listItems[index].isFinished = true;
          return newTodoList;
        });
        break;

      case "uncheck":
        setTodoList((prevTodoList) => {
          const newTodoList = { ...prevTodoList };
          newTodoList.listItems[index].isFinished = false;
          return newTodoList;
        });
        break;

      default:
        break;
    }
    setTodoList((prevTodoList) => {
      const newTodoList = { ...prevTodoList };
      const isFinishedValue = newTodoList.listItems[index].isFinished;
      newTodoList.listItems[index].isFinished = !isFinishedValue;
      return newTodoList;
    });
  }

  //Prompt handles
  function handlePromptSubmit(
    action: string,
    value: string,
    index?: number,
    columnIndex?: number
  ) {
    switch (action) {
      case "addTodoItem":
        handleAddTodoItem(value);
        setPromptShown(false);
        break;

      case "editTodoItem":
        handleEditTodoItem(value, index);
        setPromptShown(false);
        break;

      case "addTile":
        handleAddKanbanItem(value);
        setPromptShown(false);
        break;

      case "editTile":
        handleEditKanbanItem(value, index, columnIndex);
        setPromptShown(false);
        break;

      default:
        break;
    }
  }

  function handleCancelPromptSubmit() {
    setPromptShown(false);
  }

  function handleShowPrompt(
    text: string,
    action: string,
    index?: number,
    columnIndex?: number
  ) {
    setPrompt(
      <Prompt
        text={text}
        action={action}
        index={index}
        columnIndex={columnIndex}
        submit={handlePromptSubmit}
        cancelSubmit={handleCancelPromptSubmit}
      />
    );
    setPromptShown(true);
  }

  function currentDate() {
    const date = new Date();
    const [day, month, year] = [
      date.getDate(),
      date.getMonth() + 1,
      date.getFullYear(),
    ];
    const [hour, minutes, seconds] = [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ];

    console.log(month);
    return (
      day +
      "/" +
      month +
      "/" +
      year +
      " | " +
      hour +
      ":" +
      minutes +
      ":" +
      seconds
    );
  }

  // Kanban Module
  function handleAddKanbanItem(value: string) {
    const newTile = {
      id: uuid(),
      value: value,
      date: "",
    };
    const newBoard: KanbanBoard = { ...board };
    newBoard.columns[0].cards.push(newTile);
    setBoard(newBoard);
  }

  function handleDeleteKanbanItem(index: number, columnIndex: number) {
    const newBoard: KanbanBoard = { ...board };
    newBoard.columns[columnIndex].cards.splice(index, 1);
    setBoard(newBoard);
  }

  function handleEditKanbanItem(
    value: string,
    index: number,
    columnIndex: number
  ) {
    if (board.columns[columnIndex].cards[index]) {
      const newTile = {
        id: uuid(),
        value: value,
        date: "",
      };
      const newBoard = { ...board };
      newBoard.columns[columnIndex].cards.splice(index, 1, newTile);
      setBoard(newBoard);
    }
  }

  function handleSwitchModule(moduleClicked: string) {
    if (module !== moduleClicked) {
      setModule(moduleClicked);
      console.log("different!");
    }
    console.log(module);
  }

  const [activeModule, setActiveModule] = useState<JSX.Element>(
    <Todo
      key={uuid()}
      list={todoList}
      showPrompt={handleShowPrompt}
      handleDeleteTodoItem={handleDeleteTodoItem}
      handleSwitchItemStatus={handleSwitchTodoItemStatus}
    />
  );

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.log("Browser doesn't support speech recognition.");
    }

    const localBoard: KanbanBoard = JSON.parse(localStorage.getItem("board"));
    if (localBoard) {
      setBoard(localBoard);
    }

    const localTodoList = JSON.parse(localStorage.getItem("todoList"));
    if (localTodoList) {
      setTodoList(localTodoList);
    }
  }, []);

  useEffect(() => {
    if (module === "todo") {
      localStorage.setItem("todoList", JSON.stringify(todoList));
      setActiveModule(() => (
        <Todo
          key={uuid()}
          list={todoList}
          showPrompt={handleShowPrompt}
          handleDeleteTodoItem={handleDeleteTodoItem}
          handleSwitchItemStatus={handleSwitchTodoItemStatus}
        />
      ));
      setDeletedSection(() => <DeletedTodo list={deletedTodoList} />);
      //TODO: setCommands(todoCommands);
      setNavStyle((prevNavStyle) => {
        const newNavStyle = [
          {
            width: "200px",
            height: "50px",
            color: "#FFFFFF",
            backgroundColor: "#445493",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.2em",
          },
          {
            width: "200px",
            height: "50px",
            color: "#A5A5A5",
            backgroundColor: "#1F273D",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.2em",
          },
        ];
        return newNavStyle;
      });
    } else {
      localStorage.setItem("board", JSON.stringify(board));

      setActiveModule(() => (
        <DragDropContext onDragEnd={onDragEnd}>
          <Board
            key={uuid()}
            layout={board}
            showPrompt={handleShowPrompt}
            handleDeleteTile={handleDeleteKanbanItem}
          />
        </DragDropContext>
      ));
      setDeletedSection(() => <DeletedTodo list={deletedBoard} />);
      //TODO: setCommands(kanbanCommands);
      setNavStyle((prevNavStyle) => {
        const newNavStyle = [
          {
            width: "200px",
            height: "50px",
            color: "#A5A5A5",
            backgroundColor: "#1F273D",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.2em",
          },
          {
            width: "200px",
            height: "50px",
            color: "#FFFFFF",
            backgroundColor: "#445493",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.2em",
          },
        ];
        return newNavStyle;
      });
    }
  }, [module, board, todoList]);

  function reorder(
    currentBoard: KanbanBoard,
    sourceId: string,
    sourceIndex: number,
    destinationId: string,
    destinationIndex: number
  ) {
    const result = { ...currentBoard };
    let sourceIdInt: number = parseInt(sourceId);
    let destinationIdInt: number = parseInt(destinationId);
    const [removed] = result.columns[sourceIdInt].cards.splice(sourceIndex, 1);
    result.columns[destinationIdInt].cards.splice(destinationIndex, 0, removed);
    return result;
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const newBoard: KanbanBoard = reorder(
      board,
      result.source.droppableId,
      result.source.index,
      result.destination.droppableId,
      result.destination.index
    );
    setBoard(newBoard);
  }

  return (
    <div className="App">
      <Navbar
        currentModule={module}
        handleSwitchModule={handleSwitchModule}
        navStyle={navStyle}
      />
      {promptShown && prompt}
      {activeModule}
      <VoiceInput
        addTodoItem={handleAddTodoItem}
        deleteTodoItem={handleDeleteTodoItem}
        editTodoItem={handleEditTodoItem}
        switchItemStatus={handleSwitchTodoItemStatus}
        addKanbanItem={handleAddKanbanItem}
        deleteKanbanItem={handleDeleteKanbanItem}
        editKanbanItem={handleEditKanbanItem}
        switchModule={handleSwitchModule}
      />
      <button
        className="actionButton deletedItemsButton"
        onClick={() => setDeletedSectionShown((prevValue) => !prevValue)}
      >
        {deletedSectionShown ? "Hide" : "Show"} Deleted Items
      </button>
      {deletedSectionShown && (
        <div className="deletedItemsWrapper">
          {/* <DeletedTodo list={deletedTodoList}/> */}
          {deletedSection}
        </div>
      )}
    </div>
  );
}
