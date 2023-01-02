import React from "react";

export default function Tile(props) {
  return (
    <div className="tile">
      <span className="tile-index">#{props.index}</span>
      <p>{props.text}</p>
    </div>
  )
}
