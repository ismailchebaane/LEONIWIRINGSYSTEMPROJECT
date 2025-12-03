# preprocess.py

import pandas as pd
from sklearn.preprocessing import LabelEncoder
from config.config import DROP_COLUMNS, CATEGORICAL_FEATURES

def load_and_clean_data(csv_path):
    df = pd.read_csv(csv_path)
    df.drop(columns=DROP_COLUMNS, inplace=True, errors='ignore')
    encoders = {}

    for col in CATEGORICAL_FEATURES:
        encoder = LabelEncoder()
        df[col] = encoder.fit_transform(df[col])
        encoders[col] = encoder

    return df, encoders
