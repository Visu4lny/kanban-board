export interface TodoList {
  listItems: Array<ListItem>;
};

export interface DeletedList {
  listItems: Array<DeletedListItem>;
};

export interface KanbanBoard {
  columns: Array<BoardColumn>;
};

export interface Command {
  command: string | string[] | RegExp;
  callback: (...args: any[]) => unknown;
  isFuzzyMatch?: boolean | undefined;
  matchInterim?: boolean | undefined;
  fuzzyMatchingThreshold?: number | undefined;
  bestMatchOnly?: boolean | undefined;
}

export interface Tasks {
 [key:string]: Task;
}

export interface Task {
  id: number;
  value: string;
  finished: boolean;
  date?: string;
}

interface ListItem {
  id: string;
  value: string;
  isFinished: boolean;
  date: string;
};

interface DeletedListItem {
  id: string;
  value: string;
  deletedDate: string;
};

interface BoardColumn {
  id: string;
  title: string;
  cards: Array<Card>;
};

interface Card {
  id: string;
  value: string;
  date: string;
};
