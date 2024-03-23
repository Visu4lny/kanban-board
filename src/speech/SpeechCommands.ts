import { Command } from "../types/interfaces";

type Commands = Array<Command>;

export const kanbanCommands: Commands = [
  {
    command: "to do *",
    callback: (tileText) => addTile(tileText),
  },
  {
    command: "move number :tileNumber from * to *",
    callback: (tileNumber, columnFrom, columnTo) =>
      moveTile(tileNumber, columnFrom, columnTo),
  },
  {
    command: "delete number :tileNumber from *",
    callback: (tileNumber, column) => deleteTile(tileNumber, column),
  },
  {
    command: "edit number :tileNumber from * to *",
    callback: (tileNumber, column, newValue) =>
      editTile(tileNumber, column, newValue),
  },
  {
    command: "switch to *",
    callback: (moduleName) => switchModule(moduleName),
  },
];

export const todoCommands: Commands = [
  {
    command: "to do *",
    callback: (text) => addTodo(text),
  },
  {
    command: "check number :todoNumber",
    callback: (todoNumber) => checkNumber(todoNumber),
  },
  {
    command: "uncheck number :todoNumber",
    callback: (todoNumber) => unCheckNumber(todoNumber),
  },
  {
    command: "delete number :itemNumber",
    callback: (itemNumber) => deleteListItem(itemNumber),
  },
  {
    command: "edit number :tileNumber to *",
    callback: (tileNumber, newValue) => editListItem(tileNumber, newValue),
  },
  {
    command: "switch to *",
    callback: (moduleName) => switchModule(moduleName),
  },
];

function addTodo(text: string) {
  /* setTodoList(prevTodoList => {
   *   const newTodoList = {...prevTodoList};
   *   const itemValue = text;
   *   newTodoList.listItems.push({
   *     id: uuid(),
   *     value: itemValue,
   *     isFinished: false,
   *     date: ""
   *   });
   *   stopListening();
   *   return newTodoList;
   * }) */
}

function checkNumber(number: string) {
  /* let intNumber: number = formatNumber(number);
   * setTodoList(prevTodoList => {
   *   const newTodoList = {...prevTodoList};
   *   // newTodoList.listItems[intNumber].isFinished = true;
   *   stopListening();
   *   return newTodoList;
   * }) */
}

function unCheckNumber(number: string) {
  /* let intNumber: number = formatNumber(number);
   * setTodoList(prevTodoList => {
   *   const newTodoList = {...prevTodoList};
   *   newTodoList.listItems[intNumber].isFinished = false;
   *   stopListening();
   *   return newTodoList;
   * }) */
}

function editListItem(number: string, value: string) {
  /* let intNumber: number = formatNumber(number);
   * setTodoList(prevTodoList => {
   *   const newTodoList = {...prevTodoList};
   *   const newItem = {
   *     id: uuid(),
   *     value: value,
   *     isFinished: false,
   *     date: ""
   *   }
   *   newTodoList.listItems.splice(intNumber, 1, newItem);
   *   stopListening();
   *   return newTodoList;
   * }) */
}

function deleteListItem(number: string) {
  /* let intNumber: number = formatNumber(number);
   * setTodoList(prevTodoList => {
   *   const newTodoList = {...prevTodoList};
   *   newTodoList.listItems.splice(intNumber, 1);
   *   stopListening();
   *   return newTodoList;
   * }) */
}

function addTile(text: string) {
  //   setBoard((prevBoard) => {
  //     const newBoard: KanbanBoard = { ...prevBoard };
  //     const tileValue: string = text;
  //     newBoard.columns[0].cards.push({
  //       id: uuid(),
  //       value: tileValue,
  //       date: "",
  //     });
  //     stopListening();
  //     return newBoard;
  //   });
}

function moveTile(number: string, columnFrom: string, columnTo: string) {
  //   let intNumber: number = formatNumber(number);
  //   const columnFromIndex: number = boardColumns.indexOf(columnFrom);
  //   const columnToIndex: number = boardColumns.indexOf(columnTo);
  //   if (
  //     columnFromIndex !== -1 &&
  //     columnToIndex !== -1 &&
  //     board.columns[columnFromIndex].cards.length >= intNumber
  //   ) {
  //     try {
  //       setBoard((prevBoard) => {
  //         const newBoard: KanbanBoard = { ...prevBoard };
  //         const [removed] = newBoard.columns[columnFromIndex].cards.splice(
  //           intNumber,
  //           1
  //         );
  //         newBoard.columns[columnToIndex].cards.push(removed);
  //         stopListening();
  //         return newBoard;
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
}

function deleteTile(number: string, column: string) {
  //   let intNumber: number = formatNumber(number);
  //   const columnIndex: number = boardColumns.indexOf(column);
  //   if (columnIndex !== -1) {
  //     setBoard((prevBoard) => {
  //       const newBoard: KanbanBoard = { ...prevBoard };
  //       newBoard.columns[columnIndex].cards.splice(intNumber, 1);
  //       stopListening();
  //       return newBoard;
  //     });
  //   }
}

function editTile(number: string, column: string, value: string) {
  //   let intNumber: number = formatNumber(number);
  //   const columnIndex = boardColumns.indexOf(column);
  //   if (columnIndex !== -1 && board.columns[columnIndex].cards[intNumber]) {
  //     setBoard((prevBoard) => {
  //       const newBoard: KanbanBoard = { ...prevBoard };
  //       const newTile = {
  //         id: uuid(),
  //         value: value,
  //         date: "",
  //       };
  //       newBoard.columns[columnIndex].cards.splice(intNumber, 1, newTile);
  //       stopListening();
  //       return newBoard;
  //     });
  //   }
}

function switchModule(moduleName: string) {
  //   moduleName = moduleName.replace(" ", "");
  //   if (moduleName === "to do" || moduleName === "do") {
  //     moduleName = "todo";
  //   }
  //   stopListening();
  //   setModule(moduleName);
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
