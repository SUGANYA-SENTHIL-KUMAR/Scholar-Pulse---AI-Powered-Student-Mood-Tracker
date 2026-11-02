// src/components/MoodResult.jsx
import React, { useState, useEffect } from "react";
import moodData from "../data/moodData";
import ExerciseList from "./ExerciseList";
import CounselorPrompt from "./CounselorPrompt";

function MoodResult({ result }) {
  const { emotion: mood, confidence: rawConfidence, riskLevel, sentiment, voiceEnergy } = result;
  const confidence = Math.round(rawConfidence * 100);
  const [showCounselorPrompt, setShowCounselorPrompt] = useState(false);
+
  // Show the counselor popup whenever a qualifying mood is detected.
  useEffect(() => {
    const isDifficultMood = mood === "Sad" || mood === "Angry";
    if (isDifficultMood && confidence >= 50) {
      setShowCounselorPrompt(true);
    } else {
      setShowCounselorPrompt(false);
    }
  }, [mood, confidence]);

  if (!mood) return null;

  const data = moodData[mood] || moodData.Neutral;

  return (
    <div className="mood-result" style={{ "--mood-accent": data.color }}>
      <div className="mood-emoji">{data.emoji}</div>
      <h2 className="mood-name">{mood}</h2>
      <p className="mood-confidence">{confidence}% confidence</p>
      <div className="metrics"><span>Sentiment <b>{sentiment?.compound ?? 0}</b></span><span>Voice energy <b>{(voiceEnergy ?? 0).toFixed(3)}</b></span><span className={`risk ${riskLevel}`}>{riskLevel} risk</span></div>
      <p className="mood-message">{data.message}</p>

      <ExerciseList exercises={data.exercises} />

      {showCounselorPrompt && (
        <CounselorPrompt onClose={() => setShowCounselorPrompt(false)} />
      )}
    </div>
  );
}

export default MoodResult;
