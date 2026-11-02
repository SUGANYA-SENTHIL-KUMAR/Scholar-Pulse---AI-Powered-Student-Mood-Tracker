// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import CounselorPage from "./pages/CounselorPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<Protected><MoodTrackerPage /></Protected>} />
        <Route path="/counsellors" element={<Protected><CounselorPage /></Protected>} />
        <Route path="/counselors" element={<Navigate to="/counsellors" replace />} />
        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/history" element={<Protected><HistoryPage /></Protected>} />
      </Routes>
    </div>
  );
}
function Protected({children}){return localStorage.getItem("mood_token")?children:<Navigate to="/login" replace/>}

export default App;
