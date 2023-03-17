import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import uuid from 'react-uuid';
import Tile from "./Tile";
import { KanbanBoard } from "../interfaces/interfaces";
import CSS from 'csstype';
import {
  DroppableProvided,
  DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot
} from 'react-beautiful-dnd';

type BoardProps = {
  layout: KanbanBoard,
  showPrompt: (text: string, action: string, index?: number, columnIndex?: number) => void,
  handleDeleteTile: (index: number, column: number) => void
};

export default function Board(props: BoardProps) {

  const getItemStyle: (isDragging: boolean, draggableStyle: any) => 
    CSS.Properties = (isDragging, draggableStyle) => ({
      userSelect: "none",
      padding: "10px 10px",
      textAlign: "left",
      borderRadius: "4px",
      boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.12)",
      margin: "10px 0",
      fontSize: "1.4em",
    
      // change background colour if dragging
      backgroundColor: isDragging ? "#596ca1" : "#38466b",
    
      // styles needed to apply on draggables
      ...draggableStyle
  });

  const getListStyle: (isDraggingOver: boolean) => CSS.Properties = isDraggingOver => ({
    background: isDraggingOver ? "#1c2233" : "#1f273d",
    backgroundColor: "#1f273d",
    borderRadius: "4px",
    padding: "0 20px 10px 20px"
  });

  const todoTiles: Array<JSX.Element> = props.layout.columns[0].cards.map((item, index) => {
    const itemId = uuid();
    return (
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            <Tile
              key={itemId}
              text={item.value}
              index={index}
              column={0}
              date={item.date}
              showPrompt={props.showPrompt}
              handleDeleteTile={props.handleDeleteTile}
            />
          </div>
        )}
      </Draggable>
    )
  });
  const progressTiles: Array<JSX.Element> = props.layout.columns[1].cards.map((item, index) => {
    const itemId = uuid();
    return (
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            <Tile
              key={itemId}
              text={item.value}
              index={index}
              column={1}
              date={item.date}
              showPrompt={props.showPrompt}
              handleDeleteTile={props.handleDeleteTile}
            />
          </div>
        )}
      </Draggable>
    )
  });
  const doneTiles: Array<JSX.Element> = props.layout.columns[2].cards.map((item, index) => {
    const itemId = uuid();
    return (
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            <Tile
              key={itemId}
              text={item.value}
              index={index}
              column={2}
              date={item.date}
              showPrompt={props.showPrompt}
              handleDeleteTile={props.handleDeleteTile}
            />
          </div>
        )}
      </Draggable>
    )
  });

  return (
    <div className="board">
      <Droppable droppableId="0">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <div className="board--column">
              <h2>{props.layout.columns[0].title}</h2>
              <hr />
              {todoTiles.length > 0 && 
                <div className="board--tileWrapper">
                  {todoTiles}
                </div>
              }
              <div className="board--addButton">
                <button onClick={() => props.showPrompt("New tile:", "addTile")}>Add new tile</button>
              </div>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="1">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <div className="board--column">
              <h2>{props.layout.columns[1].title}</h2>
              <hr />
              {progressTiles.length > 0 && 
                <div className="board--tileWrapper">
                  {progressTiles}
                </div>
              }
            </div>
          {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="2">
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <div className="board--column">
              <h2>{props.layout.columns[2].title}</h2>
              <hr />
              {doneTiles.length > 0 && 
                <div className="board--tileWrapper">
                  {doneTiles}
                </div>
              }
            </div>
          {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
