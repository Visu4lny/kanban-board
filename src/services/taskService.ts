import api from "./api";
import { Task } from "../types/task";

export const getAllTasks = (): Promise<Task[]> =>
  api.get("/task/sorted").then((response) => response.data);

export const addTask = (newTask: Task): Promise<Task> =>
  api.post("/task", newTask).then((response) => response.data);

export const deleteTask = (id: number): Promise<Task> =>
  api
    .delete(`/task/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting task:", error);
    });

export const editTask = (id: number, value: string): Promise<Task> =>
  api
    .put(`/task/${id}?value=${value}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error editing task:", error);
    });

export const setFinished = (id: number, isFinished: boolean): Promise<Task> =>
  api
    .put(`/task/finished/${id}?isFinished=${isFinished}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error setting task finished status:", error);
    });
