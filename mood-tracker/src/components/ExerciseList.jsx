// src/components/ExerciseList.jsx
import React from "react";

function ExerciseList({ exercises }) {
  if (!exercises || exercises.length === 0) return null;

  return (
    <div className="exercise-list">
      <h3 className="exercise-title">Try this</h3>
      <ul>
        {exercises.map((exercise, index) => (
          <li key={index}>{exercise}</li>
        ))}
      </ul>
    </div>
  );
}

export default ExerciseList;
