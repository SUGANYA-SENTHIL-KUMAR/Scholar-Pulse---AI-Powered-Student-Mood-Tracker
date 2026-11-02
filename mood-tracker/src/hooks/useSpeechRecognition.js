// src/hooks/useSpeechRecognition.js
//
// Small wrapper around the browser's Web Speech API (SpeechRecognition).
// Exposes: isSupported, isListening, transcript, start(), stop(), reset().
import { useEffect, useRef, useState, useCallback } from "react";

function getRecognitionCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function useSpeechRecognition() {
  const RecognitionCtor = getRecognitionCtor();
  const isSupported = !!RecognitionCtor;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new RecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript + " ";
      }
      setTranscript(finalTranscript.trim());
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setTranscript("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      // start() throws if already started — safe to ignore
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return { isSupported, isListening, transcript, error, start, stop, reset };
}
