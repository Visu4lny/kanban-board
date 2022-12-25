import React from "react";
import uuid from 'react-uuid';
import Tile from "./Tile";

export default function Board(props) {
  const todoTiles = props.layout.columns[0].cards.map(item =>
    <Tile key={uuid()} text={item.value} />
  );
  const progressTiles = props.layout.columns[1].cards.map(item =>
    <Tile key={uuid()} text = {item.value} /> 
  );
  const doneTiles = props.layout.columns[2].cards.map(item =>
    <Tile key={uuid()} text = {item.value} />
  );

  return (
    <div className="board">
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
      <div className="board--column">
        <h2>{props.layout.columns[1].title}</h2>
        <hr />
        {progressTiles.length > 0 && 
          <div className="board--tileWrapper">
            {progressTiles}
          </div>
        }
        
      </div>
      <div className="board--column">
        <h2>{props.layout.columns[2].title}</h2>
        <hr />
        {doneTiles.length > 0 && 
          <div className="board--tileWrapper">
            {doneTiles}
          </div>
        }
      </div>
    </div>
  )
}