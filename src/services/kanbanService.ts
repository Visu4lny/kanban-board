import api from "./api";
import { Card } from "../types/card";

export const getCardsFromColumn = (columnId: number): Promise<Card[]> =>
  api
    .get(`/kanban/column/${columnId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error recieving cards:", error);
    });

export const addCard = (newCard: Card): Promise<Card> =>
  api
    .post("/kanban", newCard)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error adding new card:", error);
    });

export const deleteCard = (id: number): Promise<Card> =>
  api
    .delete(`/kanban/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting card:", error);
    });

export const editCard = (id: number, value: string): Promise<Card> =>
  api
    .put(`/kanban/${id}?value=${value}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error editing card:", error);
    });
