# predict_rul.py

import pandas as pd
import joblib
from config.config import FEATURES, CATEGORICAL_FEATURES
import os
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "models"))
def predict(sample_dict):
    # Load saved model and encoders
    model_path = os.path.join(BASE_DIR, "best_model.pkl")
    encoders_path = os.path.join(BASE_DIR, "encoders.pkl")
    model = joblib.load(model_path)
    encoders = joblib.load(encoders_path)

    df = pd.DataFrame([sample_dict])
    for col in CATEGORICAL_FEATURES:
        df[col] = encoders[col].transform(df[col])

    df = df[FEATURES]
    prediction = model.predict(df)[0]
    return prediction


