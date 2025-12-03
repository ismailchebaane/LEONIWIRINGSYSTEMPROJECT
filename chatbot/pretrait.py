import pandas as pd
import numpy as np
import random


# Load your dataset
df = pd.read_csv("data/Dataset.csv", encoding="cp1252")
print("🔹 Raw loaded data:\n", df.head())

# Normalize column names
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace('\n', ' ', regex=False)
    .str.replace('\r', '', regex=False)
)
print("🔹 After normalizing column names:\n", df.columns.tolist())

# Drop unwanted columns
columns_to_drop = ["nom d'équipement", "id technique", "physical status"]
df = df.drop(columns=[col for col in columns_to_drop if col in df.columns])
print("🔹 After dropping unwanted columns:\n", df.head())

# Rename columns
rename_map = {
    "nom d'équipement":"equipment_name",
    "id technique" :"technical_id",

    "plant": "plant",
    "process": "process",
    "nom master data": "master_data_name",
    "emplacement": "location",
    "immo number": "immobilization_number",
    "numéro de série": "serial_number",
    "année (plaque signalitique)": "year",
    "commersialisation d'équipement": "equipment_commercialized",
    "commersialisation pdr": "pdr_commercialized",
    "age": "age",
    "d(degradabilite": "degradability",
    "hp ( heure de production )": "production_hours",
    "hp coef": "hp_coefficient",
    "p pdr ( piece de rechange)": "replacement_parts",
    "mt (deux facteur mttr et mtbf ) mttr : main time to repair , mtbf : main time between failure": "maintenance_mttr_mtbf",
    "t (technologie": "technology",
    "aging result": "aging_result",
    "equipment status": "equipment_status",
"physical status" : "physical_status"
}
df = df.rename(columns={k: v for k, v in rename_map.items() if k in df.columns})
print("🔹 After renaming columns:\n", df.head())
print("Normalized column names:")
for col in df.columns:
    print(f"- '{col}'")
# Convert "OUI"/"NON" to boolean
boolean_columns = ["equipment_commercialized", "pdr_commercialized"]
for col in boolean_columns:
    if col in df.columns:
        df[col] = df[col].astype(str).str.strip().str.upper().map({"OUI": True, "NON": False})
print("🔹 After converting OUI/NON to True/False:\n", df[boolean_columns].head())

# Fill missing immobilization_number
def generate_unique_code(existing_set, prefix, length=6):
    while True:
        code = f"{prefix}{random.randint(10**(length-1), 10**length - 1)}"
        if code not in existing_set:
            existing_set.add(code)
            return code

existing_immo = set(df["immobilization_number"].dropna().astype(str))
df["immobilization_number"] = df["immobilization_number"].astype(str).replace("nan", np.nan)
df["immobilization_number"] = df["immobilization_number"].apply(
    lambda x: generate_unique_code(existing_immo, "immo") if pd.isna(x) else x
)
print("🔹 After filling missing immobilization_number:\n", df["immobilization_number"].head())

# Fill missing serial_number
existing_serial = set(df["serial_number"].dropna().astype(str))
df["serial_number"] = df["serial_number"].astype(str).replace("nan", np.nan)
df["serial_number"] = df["serial_number"].apply(
    lambda x: generate_unique_code(existing_serial, "NS") if pd.isna(x) else x
)
print("🔹 After filling missing serial_number:\n", df["serial_number"].head())

# Fill missing year
df["year"] = df["year"].apply(
    lambda x: random.randint(1963, 2025) if pd.isna(x) or str(x).strip() == "" else int(x)
)
print("🔹 After filling missing year:\n", df["year"].head())

# Fill missing booleans
for col in boolean_columns:
    if col in df.columns:
        df[col] = df[col].apply(lambda x: random.choice([True, False]) if pd.isna(x) else x)
print("🔹 After filling missing boolean values:\n", df[boolean_columns].head())

# Calculate age
df["age"] = 2025 - df["year"]
print("🔹 After calculating age:\n", df[["year", "age"]].head())


# Fill missing aging_result
if "aging_result" in df.columns:
    missing_before = df["aging_result"].isna().sum()
    df.loc[df["aging_result"].isna(), "aging_result"] = (
        df["degradability"].fillna(0).astype(float) * 0.6 +
        df["hp_coefficient"].fillna(0).astype(float) * 0.1 +
        df["replacement_parts"].fillna(0).astype(float) * 0.2 +
        df["maintenance_mttr_mtbf"].fillna(0).astype(float) * 0.05 +
        df["technology"].fillna(0).astype(float) * 0.05
    )
    missing_after = df["aging_result"].isna().sum()
    print(f"🔹 Filled {missing_before - missing_after} missing values in 'aging_result'")
else:
    print("⚠️ 'aging_result' column not found!")

# Calculate equipment_status
def get_equipment_status(score):
    if score <= 0.2:
        return "Excellent"
    elif score <= 0.4:
        return "Bon"
    elif score <= 0.6:
        return "Moyen"
    elif score <= 0.8:
        return "Alarmant"
    else:
        return "Besoin Upgrade"

df["equipment_status"] = df["aging_result"].apply(get_equipment_status)
print("🔹 After determining equipment_status:\n", df[["aging_result", "equipment_status"]].head())

df.to_csv("data/Dashboarddataset.csv", index=False, encoding="utf-8")
