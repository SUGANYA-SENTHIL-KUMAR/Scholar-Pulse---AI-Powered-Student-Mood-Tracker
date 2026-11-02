// src/components/MicButton.jsx
import React from "react";

function MicButton({ isListening, onClick, disabled }) {
  return (
    <button
      className={`mic-btn ${isListening ? "listening" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isListening}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      <span className="mic-icon">{isListening ? "⏹️" : "🎤"}</span>
      <span>{isListening ? "Stop" : "Speak"}</span>
    </button>
  );
}

export default MicButton;
