// src/hooks/useVoiceEnergy.js
//
// Very simple "voice tone" reading: measures average microphone loudness
// (0-1) while the user is speaking, using the Web Audio API. This is used
// as a rough, beginner-friendly stand-in for full tone/pitch analysis —
// it does not do any deep audio processing.
import { useRef, useState, useCallback } from "react";

export function useVoiceEnergy() {
  const [energyLevel, setEnergyLevel] = useState(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const samplesRef = useRef([]);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      samplesRef.current = [];

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const sample = () => {
        analyser.getByteTimeDomainData(dataArray);
        // Compute a simple RMS loudness value from the waveform
        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        samplesRef.current.push(rms);
        rafRef.current = requestAnimationFrame(sample);
      };

      sample();
    } catch (err) {
      // Microphone access for tone analysis is optional — if it fails,
      // mood detection still works from text alone.
      setEnergyLevel(null);
    }
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
    }

    const samples = samplesRef.current;
    if (samples.length > 0) {
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
      // Scale roughly into a 0-1 "energy" range for typical speech volume
      const scaled = Math.min(1, avg * 4);
      setEnergyLevel(scaled);
    } else {
      setEnergyLevel(null);
    }
  }, []);

  const reset = useCallback(() => {
    samplesRef.current = [];
    setEnergyLevel(null);
  }, []);

  return { energyLevel, start, stop, reset };
}
