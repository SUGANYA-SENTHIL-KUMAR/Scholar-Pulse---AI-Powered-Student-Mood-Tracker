# WellSpeak — Student Mood Tracker & Wellness App

An AI/ML final-year project that combines browser speech recognition, VADER sentiment, Librosa acoustic analysis, a trainable speech-emotion classifier, and a MongoDB-backed student dashboard. It is a wellness reflection tool, not a clinical diagnosis or emergency service.

## Structure

- `src/` — React/Vite client: protected routes, live speech transcript, recording, results, history, analytics, and hard-coded counsellor directory.
- `server/` — Express/MongoDB API with JWT authentication and persistent mood entries.
- `ml-service/` — Flask API that performs VADER analysis, acoustic feature extraction, multimodal risk classification, and model training.

## Quick start

1. Copy `.env.example` to `server/.env`, then provide your MongoDB Atlas URI and a long JWT secret. Copy `ml-service/.env.example` to `ml-service/.env` if you need to change defaults.
2. In the client folder, run `npm install` and `npm run dev`.
3. In `server`, run `npm install` and `npm run dev`.
4. Create a Python virtual environment in `ml-service`, activate it, run `pip install -r requirements.txt`, then `python app.py`.

The client uses `http://localhost:5000/api` by default. Set `VITE_API_URL` if your API runs elsewhere.

## Train an emotion model

Download and extract speech datasets such as [RAVDESS](https://zenodo.org/records/1188976), [TESS](https://tspace.library.utoronto.ca/handle/1807/24487), [CREMA-D](https://github.com/CheyneyComputerScience/CREMA-D), or [SAVEE](http://kahlan.eps.surrey.ac.uk/savee/). Put WAV files below `ml-service/data/`, then run:

```powershell
python train.py --data data --output models/emotion_model.joblib
```

The script compares Decision Tree, Random Forest, SVM, and Logistic Regression using accuracy, precision, recall, and F1; it saves the best pipeline plus a metrics CSV and confusion matrix. Until a model is trained, the service remains runnable using a clearly bounded sentiment/acoustic fallback.

## Notes

Use Chrome or Edge for the Web Speech API. The API gracefully reports unavailable ML, MongoDB, microphone, and unsupported recognition errors. Counsellor details are sample hard-coded data; replace them with verified local resources before real use.
