import streamlit as st
import pandas as pd
from pandasai import SmartDataframe
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from pandasai.prompts.base import BasePrompt
from jinja2 import Template
import os


# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# === Inline Custom Prompt Class ===
class CustomPrompt(BasePrompt):
    def __init__(self, **kwargs):
        self.props = kwargs
        self._resolved_prompt = None

        # Inline Jinja2 template
        self.template = Template("""
        You are a Python data analysis expert.
        Analyze the DataFrame to answer the following question:
        Question: {{ question }}
        DataFrame Columns: {{ columns }}

        Respond with only the Python code wrapped in triple backticks. No explanation.
        """)

    def to_string(self) -> str:
        self._resolved_prompt = self.template.render(**self.props)
        return self._resolved_prompt


# === Function to process query ===
def chat_with_csv(df, query):
    # Get API key from env or hardcoded
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY not found in environment variables")

    # Initialize LLM
    llm = ChatGroq(
        groq_api_key=groq_api_key,
        model_name="llama-3.3-70b-versatile",
        temperature=0.2,
        stream=False,
    )

    # Create custom prompt with inline template
    custom_prompt = CustomPrompt(
        question=query,
        columns=list(df.columns)
    )

    # Use SmartDataFrame with config
    pandas_ai = SmartDataframe(df, config={
        "llm": llm,
        "custom_prompt": custom_prompt,
    })

    # Run the query on the dataframe
    result = pandas_ai.chat(query)
    return result


# === Streamlit UI ===
st.set_page_config(layout='wide')
st.title("Assistant Chatbot : ")

# Upload CSVs
input_csvs = st.sidebar.file_uploader(
    "Upload your CSV files",
    type=['csv'],
    accept_multiple_files=True
)

if input_csvs:
    selected_file = st.selectbox("Select a CSV file", [file.name for file in input_csvs])
    selected_index = [file.name for file in input_csvs].index(selected_file)

    # Load selected file
    data = pd.read_csv(input_csvs[selected_index])
    st.success("CSV uploaded successfully")
    st.dataframe(data.head(3), use_container_width=True)

    # Query input
    input_text = st.text_area("Enter your query")

    if input_text and st.button("Chat with csv"):
        st.info("Your Query: " + input_text)
        try:
            result = chat_with_csv(data, input_text)
            st.success(result)
        except Exception as e:
            st.error(f"Error: {e}")
