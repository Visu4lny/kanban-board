import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./App.css";
import Navbar from "./components/Navbar";
import Todo from "./components/Todo";
import DeletedTodo from "./components/DeletedTodo";
import Board from "./components/Board";
import Prompt from "./components/Prompt";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import initialBoard from "./data/InitBoard";
import initialDeletedTodoList from "./data/InitDeletedTodoList";
import initialDeletedBoard from "./data/InitDeletedBoard";
import React from "react";
import { KanbanBoard, DeletedList } from "./types/interfaces";
import { Task } from "./types/task";
import {
  getAllTasks,
  addTask,
  deleteTask,
  editTask,
  setFinished,
} from "./services/taskService";
import SpeechRecognition from "react-speech-recognition";
import { getCardsFromColumn } from "./services/kanbanService";

export default function App() {
  const [board, setBoard] = useState<KanbanBoard>(initialBoard);
  const [kanbanColumns, setKanbanColumns] = useState([]);
  const [deletedBoard, setDeletedBoard] =
    useState<DeletedList>(initialDeletedBoard);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTodoList, setDeletedTodoList] = useState<DeletedList>(
    initialDeletedTodoList
  );
  const [module, setModule] = useState<string>("todo");
  const [deletedSectionShown, setDeletedSectionShown] =
    useState<boolean>(false);
  const [deletedSection, setDeletedSection] = useState<JSX.Element>();
  const [prompt, setPrompt] = useState<JSX.Element>();
  const [promptShown, setPromptShown] = useState<boolean>(false);

  function handleAddTile(value: string) {
    const newTile = {
      id: uuid(),
      value: value,
      date: "",
    };
    const newBoard: KanbanBoard = { ...board };
    newBoard.columns[0].cards.push(newTile);
    setBoard(newBoard);
  }

  async function handleAddTask(value: string) {
    const newTask: Task = {
      value: value,
      position: tasks[tasks.length - 1].position + 1,
      finished: false,
    };

    addTask(newTask)
      .then((addedTask) => {
        setTasks((prevTasks) => [...prevTasks, addedTask]);
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  }

  async function handleDeleteTask(position: number) {
    if (typeof tasks[position] !== "undefined") {
      const id = tasks[position].id;
      deleteTask(id);
      setTasks(
        tasks.filter((task) => {
          return task.id !== id;
        })
      );
    } else {
      console.error("Error deleting task: Task id is undefined");
    }
  }

  async function handleEditTask(position: number, value: string) {
    if (typeof tasks[position] !== "undefined") {
      const id = tasks[position].id;
      editTask(id, value).then((editedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editedTask.id ? editedTask : task
          )
        );
      });
    } else {
      console.error("Error editing task: Task id is undefined");
    }
  }

  function handlePromptSubmit(
    action: string,
    value: string,
    id?: number,
    columnIndex?: number
  ) {
    switch (action) {
      case "addTodoItem":
        handleAddTask(value);
        setPromptShown(false);
        break;

      case "editTodoItem":
        handleEditTask(id, value);
        setPromptShown(false);
        break;

      case "addTile":
        handleAddTile(value);
        setPromptShown(false);
        break;

      case "editTile":
        handleEditTile(value, id, columnIndex);
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

  // function currentDate() {
  //   const date = new Date();
  //   const [day, month, year] = [
  //     date.getDate(),
  //     date.getMonth() + 1,
  //     date.getFullYear(),
  //   ];
  //   const [hour, minutes, seconds] = [
  //     date.getHours(),
  //     date.getMinutes(),
  //     date.getSeconds(),
  //   ];

  //   console.log(month);
  //   return (
  //     day +
  //     "/" +
  //     month +
  //     "/" +
  //     year +
  //     " | " +
  //     hour +
  //     ":" +
  //     minutes +
  //     ":" +
  //     seconds
  //   );
  // }

  function handleDeleteTile(index: number, columnIndex: number) {
    const newBoard: KanbanBoard = { ...board };
    newBoard.columns[columnIndex].cards.splice(index, 1);
    setBoard(newBoard);
  }

  function handleEditTile(value: string, index: number, columnIndex: number) {
    const newTile = {
      id: uuid(),
      value: value,
      date: "",
    };
    const newBoard = { ...board };
    newBoard.columns[columnIndex].cards.splice(index, 1, newTile);
    setBoard(newBoard);
  }

  function handleSwitchModule(moduleClicked: string) {
    if (module !== moduleClicked) {
      setModule(moduleClicked);
    }
  }

  async function handleSwitchItemStatus(position: number) {
    if (typeof tasks[position] !== "undefined") {
      const changedStatus = !tasks[position].finished;
      const id = tasks[position].id;
      setFinished(id, changedStatus).then((editedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editedTask.id ? editedTask : task
          )
        );
      });
    } else {
      console.error("Error editing task: Task id is undefined");
    }
  }

  const [activeModule, setActiveModule] = useState<JSX.Element>(
    <Todo
      key={uuid()}
      list={tasks}
      showPrompt={handleShowPrompt}
      handleDeleteTodoItem={handleDeleteTask}
      handleSwitchItemStatus={handleSwitchItemStatus}
    />
  );

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.log("Browser doesn't support speech recognition.");
    }

    getAllTasks().then((data) => setTasks(data));

    const fetchedKanbanColumns = [];
    for (let i = 0; i < 3; i++) {
      getCardsFromColumn(i + 1).then((value) => {
        console.log(value);
        fetchedKanbanColumns[i] = value;
      });
    }
    setKanbanColumns(fetchedKanbanColumns);
  }, []);

  useEffect(() => {
    if (module === "todo") {
      setActiveModule(() => (
        <Todo
          key={uuid()}
          list={tasks}
          showPrompt={handleShowPrompt}
          handleDeleteTodoItem={handleDeleteTask}
          handleSwitchItemStatus={handleSwitchItemStatus}
        />
      ));
      setDeletedSection(() => <DeletedTodo list={deletedTodoList} />);
    } else {
      setActiveModule(() => (
        <DragDropContext onDragEnd={onDragEnd}>
          <Board
            key={uuid()}
            layout={board}
            showPrompt={handleShowPrompt}
            handleDeleteTile={handleDeleteTile}
          />
        </DragDropContext>
      ));
      setDeletedSection(() => <DeletedTodo list={deletedBoard} />);
    }
  }, [
    module,
    board,
    tasks,
    handleShowPrompt,
    handleDeleteTask,
    deletedTodoList,
    onDragEnd,
    handleDeleteTile,
    deletedBoard,
  ]);

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
      <Navbar currentModule={module} handleSwitchModule={handleSwitchModule} />
      {promptShown && prompt}
      {activeModule}
      {/* <div className="microphone">
        <button className="actionButton" onClick={handleListen}>
          Listen
        </button>
        <p>Microphone: {voiceOn ? "on" : "off"}</p>
        <p>{transcript}</p>
      </div> */}
      <button
        className="actionButton deletedItemsButton"
        onClick={() => setDeletedSectionShown((prevValue) => !prevValue)}
      >
        {deletedSectionShown ? "Hide" : "Show"} Deleted Items
      </button>
      {deletedSectionShown && (
        <div className="deletedItemsWrapper">{deletedSection}</div>
      )}
    </div>
  );
}
