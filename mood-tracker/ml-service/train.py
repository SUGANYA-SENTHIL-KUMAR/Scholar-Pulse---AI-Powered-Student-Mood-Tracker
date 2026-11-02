"""Train and compare speech emotion models from RAVDESS/TESS/CREMA-D WAV files.
Place extracted dataset folders under data/. File names are used to infer labels; adapt label_from_path for another dataset."""
from pathlib import Path
import argparse, joblib, librosa, numpy as np, pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
RAVDESS={"01":"Neutral","02":"Calm","03":"Happy","04":"Sad","05":"Angry","06":"Fear","07":"Disgust","08":"Surprise"}
def label_from_path(p):
    parts=p.stem.split("-")
    if len(parts)>=3 and parts[2] in RAVDESS:return RAVDESS[parts[2]]
    for label in ["angry","calm","disgust","fear","happy","neutral","sad","surprise"]:
        if label in str(p).lower():return label.title()
    return None
def extract(p):
    y,sr=librosa.load(p,sr=22050,mono=True); duration=len(y)/sr
    mfcc=librosa.feature.mfcc(y=y,sr=sr,n_mfcc=13).mean(axis=1); rms=librosa.feature.rms(y=y)[0]
    pitch=librosa.yin(y,fmin=75,fmax=500,sr=sr); pitch=pitch[np.isfinite(pitch)]
    silence=1-float((np.abs(y)>0.015).mean()) if len(y) else 1
    return np.r_[mfcc,rms.mean(),pitch.mean() if len(pitch) else 0,librosa.feature.zero_crossing_rate(y)[0].mean(),librosa.feature.spectral_centroid(y=y,sr=sr)[0].mean(),duration,silence]
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--data",default="data");ap.add_argument("--output",default="models/emotion_model.joblib");args=ap.parse_args()
    files=list(Path(args.data).rglob("*.wav")); rows=[(extract(p),label_from_path(p)) for p in files if label_from_path(p)]
    if len(rows)<20: raise SystemExit("Need at least 20 labelled WAV files. Download RAVDESS, TESS, CREMA-D, or SAVEE first.")
    X=np.array([r[0] for r in rows]);y=np.array([r[1] for r in rows]); Xtr,Xte,ytr,yte=train_test_split(X,y,test_size=.2,stratify=y,random_state=42)
    models={"Decision Tree":DecisionTreeClassifier(random_state=42),"Random Forest":RandomForestClassifier(n_estimators=300,random_state=42),"SVM":SVC(probability=True,random_state=42),"Logistic Regression":LogisticRegression(max_iter=2000)}; results=[]
    for name,model in models.items():
        pipe=Pipeline([("scale",StandardScaler()),("model",model)]);pipe.fit(Xtr,ytr);pred=pipe.predict(Xte);p,r,f,_=precision_recall_fscore_support(yte,pred,average="weighted",zero_division=0);results.append((name,pipe,accuracy_score(yte,pred),p,r,f))
    best=max(results,key=lambda r:r[2]);Path(args.output).parent.mkdir(parents=True,exist_ok=True);joblib.dump(best[1],args.output);pd.DataFrame([r[0:1]+r[2:] for r in results],columns=["model","accuracy","precision","recall","f1"]).to_csv("models/model_metrics.csv",index=False); ConfusionMatrixDisplay.from_predictions(yte,best[1].predict(Xte),xticks_rotation=45);plt.tight_layout();plt.savefig("models/confusion_matrix.png");print(f"Saved {best[0]} (accuracy={best[2]:.3f}) to {args.output}")
if __name__=="__main__":main()
