"""Flask service: VADER text sentiment + Librosa acoustic features + trained classifier."""
import os, subprocess, tempfile
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
try: nltk.data.find("sentiment/vader_lexicon.zip")
except LookupError: nltk.download("vader_lexicon", quiet=True)
import librosa
import imageio_ffmpeg

app=Flask(__name__); CORS(app); vader=SentimentIntensityAnalyzer()
MODEL_PATH=os.getenv("MODEL_PATH","models/emotion_model.joblib")
EMOTIONS=["Angry","Calm","Disgust","Fear","Happy","Neutral","Sad","Surprise"]
def load_audio(path):
    if os.path.splitext(path)[1].lower() not in {".webm", ".ogg", ".opus"}:
        return librosa.load(path,sr=22050,mono=True)
    with tempfile.NamedTemporaryFile(suffix=".wav",delete=False) as tmp:
        wav_path=tmp.name
    try:
        result=subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),"-y","-i",path,"-ac","1","-ar","22050",wav_path],capture_output=True,text=True)
        if result.returncode:
            raise RuntimeError(result.stderr.strip() or "FFmpeg could not decode the recording.")
        return librosa.load(wav_path,sr=22050,mono=True)
    finally:
        if os.path.exists(wav_path): os.unlink(wav_path)
def audio_features(path):
    y,sr=load_audio(path); duration=len(y)/sr
    rms=librosa.feature.rms(y=y)[0]; mfcc=librosa.feature.mfcc(y=y,sr=sr,n_mfcc=13).mean(axis=1)
    pitch=librosa.yin(y,fmin=75,fmax=500,sr=sr); pitch=pitch[np.isfinite(pitch)]
    active=np.abs(y)>0.015; silence=1-float(active.mean()) if len(active) else 1
    values=np.r_[mfcc, rms.mean(), pitch.mean() if len(pitch) else 0, librosa.feature.zero_crossing_rate(y)[0].mean(), librosa.feature.spectral_centroid(y=y,sr=sr)[0].mean(), duration, silence]
    return values, {"mfcc":mfcc.round(3).tolist(),"rmsEnergy":round(float(rms.mean()),4),"pitch":round(float(pitch.mean()),2) if len(pitch) else 0,"zeroCrossingRate":round(float(librosa.feature.zero_crossing_rate(y)[0].mean()),4),"spectralCentroid":round(float(librosa.feature.spectral_centroid(y=y,sr=sr)[0].mean()),2),"duration":round(duration,2),"silenceRatio":round(silence,3)}
def fallback(sentiment, features):
    c=sentiment["compound"]; energy=features.get("rmsEnergy",0)
    if c <= -.55: emotion="Sad" if energy<.06 else "Angry"
    elif c >= .5: emotion="Happy"
    elif energy < .02: emotion="Calm"
    else: emotion="Neutral"
    return emotion, round(min(.85,.52+abs(c)*.35+energy),2)
def risk(emotion, sentiment):
    if emotion in ("Sad","Angry","Fear") and sentiment["compound"] < -.35: return "High"
    if emotion in ("Sad","Angry","Fear","Disgust") or sentiment["compound"] < -.1: return "Moderate"
    return "Low"
@app.post("/analyze")
def analyze():
    transcript=request.form.get("transcript","").strip()
    if not transcript:return jsonify(message="Transcript is required."),400
    sentiment=vader.polarity_scores(transcript); acoustic={"rmsEnergy":0,"duration":0,"silenceRatio":1}; vector=None
    audio=request.files.get("audio")
    if audio:
        suffix=os.path.splitext(audio.filename)[1] or ".wav"
        with tempfile.NamedTemporaryFile(suffix=suffix,delete=False) as tmp:
            audio.save(tmp.name); path=tmp.name
        try: vector,acoustic=audio_features(path)
        except Exception as exc: return jsonify(message=f"Audio analysis failed: {exc}. Install FFmpeg and ensure the browser can record WebM audio."),422
        finally: os.unlink(path)
    emotion,confidence=fallback(sentiment,acoustic)
    if vector is not None and os.path.exists(MODEL_PATH):
        try:
            model=joblib.load(MODEL_PATH); probabilities=model.predict_proba([vector])[0]; emotion=str(model.classes_[int(np.argmax(probabilities))]); confidence=round(float(max(probabilities)),2)
        except Exception as exc: app.logger.warning("Model prediction failed: %s",exc)
    words=len(transcript.split()); acoustic["speechRate"]=round(words/max(acoustic.get("duration",0.1),.1),2); acoustic["voiceEnergy"]=acoustic.get("rmsEnergy",0)
    return jsonify(emotion=emotion,confidence=confidence,riskLevel=risk(emotion,sentiment),sentiment=sentiment,voiceEnergy=acoustic["voiceEnergy"],acousticFeatures=acoustic)
@app.get("/health")
def health(): return jsonify(status="ok",modelAvailable=os.path.exists(MODEL_PATH))
if __name__=="__main__": app.run(host="0.0.0.0",port=int(os.getenv("PORT",5001)),debug=True)
