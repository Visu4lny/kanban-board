import React from "react";
import { useState } from "react";

export default function Navbar(props) {
  const defaultNavStyle = {
    width: "200px",
    height: "50px",
    color: "#A5A5A5",
    backgroundColor: "#1F273D",
    border: "none",
    borderRadius: "5px",
    fontSize: "1.2em"
  };

  const [navStyleTodo, setNavStyleTodo] = useState(defaultNavStyle);
  const [navStyleKanban, setNavStyleKanban] = useState(defaultNavStyle);

  function switchModule(selectedModule) {
    props.handleSwitchModule(selectedModule);
    if (selectedModule === "kanban") {
      setNavStyleTodo(defaultNavStyle)
      setNavStyleKanban(prevStyle => ({
        ...prevStyle,
        backgroundColor: "#445493",
        color: "#FFFFFF"
      }))
      console.log("Changed kanban!")
    } else {
      setNavStyleKanban(defaultNavStyle)
      setNavStyleTodo(prevStyle => ({
        ...prevStyle,
        backgroundColor: "#445493",
        color: "#FFFFFF"
      }))
      console.log("changed todo!")
    }
  }


  return (
    <div className="navbar">
      <button className="todoModule" style={props.navStyle[0]} onClick={() => props.handleSwitchModule("todo")}>Todo Module</button>
      <button className="kanbanModule" style={props.navStyle[1]} onClick={() => props.handleSwitchModule("kanban")}>Kanban Module</button>
    </div>
  )
}
