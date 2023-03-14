import React, { ChangeEvent } from "react";
import {useState} from "react";

type PromptProps = {
  text: string,
  action: string,
  submit: (action: string, inputValue: string) => void,
  cancelSubmit: () => void
};

export default function Prompt(props: PromptProps) {
  const [inputValue, setInputValue] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  // const promptForm = () => {
  //   if (props.action == "calendar") {
  //     return (
  //       <form>
  //         <label></label>
  //       </form>
  //     )
  //   }
  // }

  return (
    <div className="prompt">
      <label>
        {props.text}
        <input type="text" value={inputValue} onChange={handleChange} />
      </label>
      <div className="prompt--buttonWrapper">
        <button onClick={() => props.cancelSubmit}>Cancel</button>
        <button onClick={() => props.submit(props.action, inputValue)}>
          OK
        </button>
      </div>
    </div>
  );
};