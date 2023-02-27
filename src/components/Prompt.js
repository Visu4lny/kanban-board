import React from "react";
import {useState} from "react";

export default function Prompt(props) {
    const [inputValue, setInputValue] = useState("");
    function handleSubmit() {

    }

    function handleChange(event) {
        setInputValue(event.target.value);
    }

    const promptForm = () => {
        if (props.action == "calendar") {
            return (
                <form>
                    <label></label>
                </form>
            )
        }
    }

    return (
        <div className="prompt">
            <form onSubmit={handleSubmit}>
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
            </form>
        </div>
    )
}