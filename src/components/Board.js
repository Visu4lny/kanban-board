import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import uuid from 'react-uuid';
import Tile from "./Tile";

export default function Board(props) {

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: "10px 10px",
    textAlign: "left",
    backgroundColor: "#38466b",
    borderRadius: "4px",
    boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.12)",
    margin: "10px 0",
    fontSize: "1.4em",
  
    // change background colour if dragging
    backgroundColor: isDragging ? "#596ca1" : "#38466b",
  
    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "#1c2233" : "#1f273d",
    backgroundColor: "#1f273d",
    borderRadius: "4px",
    padding: "0 20px 10px 20px"
  });

  const todoTiles = props.layout.columns[0].cards.map((item, index) => {
    const itemId = uuid();
    let dateSet = item.date === "" ? false : true;
    return (
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(provided, snapshot) => (
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
              dateSet={dateSet}
              handleDeleteTile={props.handleDeleteTile}
              handleEditTile={props.handleEditTile}
            />
          </div>
        )}
      </Draggable>
    )
  });
  const progressTiles = props.layout.columns[1].cards.map((item, index) => {
    const itemId = uuid();
    return (
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(provided, snapshot) => (
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
              handleDeleteTile={props.handleDeleteTile}
              handleEditTile={props.handleEditTile}
            />
          </div>
        )}
      </Draggable>
    )
  });
  const doneTiles = props.layout.columns[2].cards.map((item, index) => {
    const itemId = uuid();
    return (
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(provided, snapshot) => (
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
              handleDeleteTile={props.handleDeleteTile}
              handleEditTile={props.handleEditTile}
            />
          </div>
        )}
      </Draggable>
    )
  });

  return (
    <div className="board">
      <Droppable droppableId="0">
        {(provided, snapshot) => (
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
                <button onClick={props.handleAddTile}>Add new tile</button>
              </div>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId="1">
        {(provided, snapshot) => (
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
        {(provided, snapshot) => (
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
  )
}
