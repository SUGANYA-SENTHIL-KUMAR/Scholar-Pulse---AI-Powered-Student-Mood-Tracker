// src/pages/MoodTrackerPage.jsx
import React, { useState, useCallback, useRef } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import api from "../api";
import Nav from "../components/Nav";
import MicButton from "../components/MicButton";
import MoodResult from "../components/MoodResult";

function MoodTrackerPage() {
  const {
    isSupported,
    isListening,
    transcript,
    error,
    start: startSpeech,
    stop: stopSpeech,
    reset: resetSpeech,
  } = useSpeechRecognition();

  const [result, setResult] = useState(null); const [analyzing, setAnalyzing] = useState(false); const [apiError, setApiError] = useState("");
  const recorderRef = useRef(null), chunksRef = useRef([]);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const analysisStartedRef = useRef(false);

  const handleStart = useCallback(async () => {
    resetSpeech();
    setResult(null); setApiError(""); setRecordingBlob(null); setRecordingComplete(false); analysisStartedRef.current=false; startSpeech();
    try { const stream=await navigator.mediaDevices.getUserMedia({audio:true}); chunksRef.current=[]; const r=new MediaRecorder(stream); r.ondataavailable=e=>e.data.size&&chunksRef.current.push(e.data); r.onstop=()=>{ setRecordingBlob(new Blob(chunksRef.current,{type:r.mimeType||"audio/webm"})); setRecordingComplete(true); stream.getTracks().forEach(t=>t.stop()); }; r.start(); recorderRef.current=r; } catch { setRecordingComplete(true); setApiError("Microphone access was denied. Mood analysis will use your transcript only."); }
  }, [startSpeech, resetSpeech]);

  const handleStop = useCallback(() => {
    stopSpeech(); if(recorderRef.current?.state!=="inactive") recorderRef.current.stop();
  }, [stopSpeech]);

  React.useEffect(() => {
    if (!isListening && recordingComplete && !analysisStartedRef.current && transcript && transcript.trim().length > 0) {
      analysisStartedRef.current=true;
      const run=async()=>{setAnalyzing(true);setApiError("");try{const form=new FormData();form.append("transcript",transcript);if(recordingBlob?.size)form.append("audio",recordingBlob,"reflection.webm");const {data}=await api.post("/moods/analyze",form);setResult(data);}catch(e){setApiError(e.response?.data?.message||"Analysis could not be completed.")}finally{setAnalyzing(false)}};run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript, recordingComplete, recordingBlob]);

  return (
    <><Nav/><div className="container">
      <header className="app-header">
        <h1>Mood Tracker</h1>
        <p className="app-subtitle">
          Speak for a few seconds and I'll try to sense how you're feeling.
        </p>
      </header>

      {!isSupported && (
        <div className="warning-card">
          Speech recognition isn't supported in this browser. Try the latest
          Chrome or Edge on desktop.
        </div>
      )}

      {isSupported && (
        <>
          <div className="mic-section">
            <MicButton
              isListening={isListening}
              onClick={isListening ? handleStop : handleStart}
            />
            {isListening && <p className="listening-hint">Listening... speak naturally.</p>}
            {error && <p className="error-text">Mic error: {error}</p>}
          </div>

          {transcript && (
            <div className="transcript-card">
              <h3 className="transcript-title">What I heard</h3>
              <p className="transcript-text">{transcript}</p>
            </div>
          )}

          {apiError && <p className="error-text">{apiError}</p>}
          {analyzing && <p className="listening-hint">Analysing your voice and words…</p>}
          {result && <MoodResult result={result} />}
        </>
      )}
    </div></>
  );
}

export default MoodTrackerPage;
