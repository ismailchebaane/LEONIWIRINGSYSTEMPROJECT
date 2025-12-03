# train_model.py

import xgboost as xgb
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np
import joblib
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from preprocess.preprocess import load_and_clean_data
from config.config import FEATURES
import matplotlib.pyplot as plt
import seaborn as sns

# === Load & clean dataset ===
df, encoders = load_and_clean_data("latest_dataset.csv")
X = df[FEATURES]
y = df['Rul']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# === Hyperparameter tuning ===
param_dist = {
    'n_estimators': [50, 100, 200, 300],
    'max_depth': [3, 5, 6, 8, 10],
    'learning_rate': [0.01, 0.03, 0.05, 0.1, 0.2],
    'subsample': [0.6, 0.8, 1.0],
    'colsample_bytree': [0.6, 0.8, 1.0]
}

model = xgb.XGBRegressor(random_state=42)
random_search = RandomizedSearchCV(model, param_dist, n_iter=30, cv=3, scoring='neg_mean_absolute_error', n_jobs=-1, verbose=2)
random_search.fit(X_train, y_train)
best_model = random_search.best_estimator_

# Save model & encoders
joblib.dump(best_model, "../models/best_model.pkl")
joblib.dump(encoders, "../models/encoders.pkl")

# === Evaluate model ===
y_test_pred = best_model.predict(X_test) #new one

y_pred = best_model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
r2_test = r2_score(y_test, y_test_pred)
r2_train = r2_score(y_train, best_model.predict(X_train))


print("✅ Model Evaluation:")
print(f"RMSE: {rmse:.2f}")
print(f"MAE: {mae:.2f}")
print(f"R² test: {r2:.2f}")

print(f"R² Train: {r2_score(y_train, best_model.predict(X_train)):.2f}")

# === Visualization Section ===

# 1. Actual vs Predicted
plt.figure(figsize=(6,6))
sns.scatterplot(x=y_test, y=y_test_pred, alpha=0.6)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
plt.xlabel("Actual RUL")
plt.ylabel("Predicted RUL")
plt.title("Actual vs Predicted RUL")
plt.show()

# 2. Residuals distribution
residuals = y_test - y_test_pred
plt.figure(figsize=(6,4))
sns.histplot(residuals, kde=True, bins=30, color="steelblue")
plt.xlabel("Residuals (Actual - Predicted)")
plt.title("Residuals Distribution")
plt.show()

# 3. Predicted vs Residuals
plt.figure(figsize=(6,4))
sns.scatterplot(x=y_test_pred, y=residuals, alpha=0.6, color="darkorange")
plt.axhline(0, color='red', linestyle='--')
plt.xlabel("Predicted RUL")
plt.ylabel("Residuals")
plt.title("Residuals vs Predicted")
plt.show()

# 4. Absolute Error Distribution
abs_errors = np.abs(residuals)
plt.figure(figsize=(6,4))
sns.histplot(abs_errors, kde=True, bins=30, color="seagreen")
plt.xlabel("Absolute Error |Actual - Predicted|")
plt.title("Absolute Error Distribution")
plt.show()

# 5. Error vs Actual RUL
plt.figure(figsize=(6,4))
sns.scatterplot(x=y_test, y=abs_errors, alpha=0.6, color="purple")
plt.xlabel("Actual RUL")
plt.ylabel("Absolute Error")
plt.title("Absolute Error vs Actual RUL")
plt.show()

# 6. Feature Importance
plt.figure(figsize=(8,6))
xgb.plot_importance(best_model, importance_type="gain", height=0.5, show_values=False)
plt.title("Feature Importance (XGBoost)")
plt.show()

# 7. Metrics Summary Bar Chart
metrics = {
    "RMSE": rmse,
    "MAE": mae,
    "R² Test": r2_test,
    "R² Train": r2_train
}
plt.figure(figsize=(6,4))
sns.barplot(x=list(metrics.keys()), y=list(metrics.values()), palette="viridis")
plt.title("Model Evaluation Metrics")
plt.ylabel("Score")
plt.show()