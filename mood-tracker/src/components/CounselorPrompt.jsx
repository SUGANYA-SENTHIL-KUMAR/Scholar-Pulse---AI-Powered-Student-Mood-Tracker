// src/components/CounselorPrompt.jsx
//
// Popup shown under the mood result when mood is Sad or Angry with
// confidence >= 50%.
import React from "react";
import { useNavigate } from "react-router-dom";

function CounselorPrompt({ onClose }) {
  const navigate = useNavigate();

  const handleYes = () => {
    navigate("/counsellors");
  };

  return (
    <div className="counselor-prompt">
      <p className="counselor-prompt-text">
        It looks like you may be experiencing emotional distress.
        <br />
        Would you like to connect with a mental health counsellor?
      </p>
      <div className="counselor-prompt-actions">
        <button className="counselor-prompt-btn yes-btn" onClick={handleYes}>
          Yes
        </button>
        <button className="counselor-prompt-btn no-btn" onClick={onClose}>
          No
        </button>
      </div>
    </div>
  );
}

export default CounselorPrompt;
