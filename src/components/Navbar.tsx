import React from "react";
import CSS from "csstype";

type NavbarProps = {
  currentModule: string;
  handleSwitchModule: (module: string) => void;
};

export default function Navbar(props: NavbarProps) {
  const navStyle: Array<CSS.Properties> = [
    {
      width: "200px",
      height: "50px",
      color: "#FFFFFF",
      backgroundColor: "#445493",
      border: "none",
      borderRadius: "5px",
      fontSize: "1.2em",
    },
    {
      width: "200px",
      height: "50px",
      color: "#A5A5A5",
      backgroundColor: "#1F273D",
      border: "none",
      borderRadius: "5px",
      fontSize: "1.2em",
    },
  ];

  return (
    <div className="navbar">
      <button
        className="todoModule"
        style={props.currentModule === "todo" ? navStyle[0] : navStyle[1]}
        onClick={() => props.handleSwitchModule("todo")}
      >
        Todo Module
      </button>
      <button
        className="kanbanModule"
        style={props.currentModule === "kanban" ? navStyle[0] : navStyle[1]}
        onClick={() => props.handleSwitchModule("kanban")}
      >
        Kanban Module
      </button>
    </div>
  );
}
