from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
from pandasai import SmartDataframe
from pandasai.prompts.base import BasePrompt
from langchain_groq import ChatGroq
from jinja2 import Template
from flask_cors import CORS



import os
import sys
import traceback
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../prediction")))

from predict_rul import predict

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000","http://localhost:3001"])


# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# Paths
CSV_PATH = "data/latest_dataset.csv"
EXPORT_DIR = os.path.join(os.getcwd(), "exports", "charts")

# Load Data for chatbot
df = pd.read_csv(CSV_PATH)

# Custom prompt class for chatbot
class CustomPrompt(BasePrompt):
    def __init__(self, **kwargs):
        self.props = kwargs
        self._resolved_prompt = None
        self.template = Template("""
        You are a Python data analysis expert.
        Analyze the DataFrame to answer the following question:
        Question: {{ question }}
        DataFrame Columns: {{ columns }}

        Respond with only the Python code wrapped in triple backticks. No explanation.
        """)
    def to_string(self):
        return self.template.render(**self.props)

# Serve images statically
@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(EXPORT_DIR, filename)

# Chatbot endpoint (existing)
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        query = data.get("query", "")

        groq_api_key = os.getenv("GROQ_API_KEY")
        llm = ChatGroq(
            groq_api_key=groq_api_key,
            model_name="llama-3.3-70b-versatile",
            temperature=0.2,
            stream=False,
        )

        custom_prompt = CustomPrompt(question=query, columns=list(df.columns))

        smart_df = SmartDataframe(df.copy(), config={
            "llm": llm,
            "custom_prompt": custom_prompt,
            "save_charts": True,
            "save_charts_path": EXPORT_DIR,
        })

        result = smart_df.chat(query)

        if isinstance(result, str) and result.endswith(".png") and os.path.exists(result):
            filename = os.path.basename(result)
            return jsonify({"answer": "image", "imageUrl": f"/images/{filename}"})

        return jsonify({"answer": str(result)})

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

# New endpoint for RUL prediction
@app.route("/predict", methods=["POST"])
def predict_rul_endpoint():
    try:
        sample_equipment = request.get_json()
        if not sample_equipment:
            return jsonify({"error": "No input data provided"}), 400

        predicted_rul = predict(sample_equipment)

        return jsonify({"predicted_rul": float(predicted_rul)})


    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

if __name__ == "__main__":
    app.run(debug=True,use_reloader=False, port=5050)
