import React from "react";
import CSS from "csstype";

type NavbarProps = {
  currentModule: string;
  handleSwitchModule: (module: string) => void;
  navStyle: Array<CSS.Properties>;
};

export default function Navbar(props: NavbarProps) {
  return (
    <div className="navbar">
      <button
        className="todoModule"
        style={props.navStyle[0]}
        onClick={() => props.handleSwitchModule("todo")}
      >
        Todo Module
      </button>
      <button
        className="kanbanModule"
        style={props.navStyle[1]}
        onClick={() => props.handleSwitchModule("kanban")}
      >
        Kanban Module
      </button>
    </div>
  );
}
