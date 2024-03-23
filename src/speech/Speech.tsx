import { useState } from "react";
import { todoCommands } from "./SpeechCommands";
import { Command } from "../types/interfaces";
import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Speech() {
  type Commands = Array<Command>;

  const [commands, setCommands] = useState<Commands>(todoCommands);
  const { transcript } = useSpeechRecognition({ commands });
  const [voiceOn, setVoiceOn] = useState(false);

  const listen = () => {
    SpeechRecognition.startListening({ continuous: true });
    setVoiceOn(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setVoiceOn(false);
  };

  function handleListen() {
    SpeechRecognition.startListening();
    listen();
  }

  return (
    <div className="microphone">
      <button className="actionButton" onClick={handleListen}>
        Listen
      </button>
      <p>Microphone: {voiceOn ? "on" : "off"}</p>
      <p>{transcript}</p>
    </div>
  );
}
