from sentence_transformers import SentenceTransformer
import uuid
import os
from sarvamai import SarvamAI
from dotenv import load_dotenv

load_dotenv()

_model = None


def load_model():
    global _model
    if _model is None:
        print("Loading model...")
        _model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
        print("Model loaded successfully.")
    return _model


def get_embedding(text: str):
    model = load_model()
    embedding = model.encode(text)
    return embedding.tolist()


def normalize_json_to_text(data, parent_key=""):
    """
    Recursively converts JSON object into meaningful searchable text.
    Works with unknown schema, nested objects, arrays.
    """
    parts = []

    if isinstance(data, dict):
        for key, value in data.items():
            new_key = f"{parent_key} {key}".strip()
            parts.append(normalize_json_to_text(value, new_key))

    elif isinstance(data, list):
        for item in data:
            parts.append(normalize_json_to_text(item, parent_key))

    else:
        if data is not None:
            parts.append(f"{parent_key} {data}")

    return ". ".join([p for p in parts if p])


def generate_session_id():
    return str(uuid.uuid4())


def summarize_data(data, query:str):
    SAVRAMAI_API_KEY = os.getenv("SARVAMAI_API_KEY")
    client = SarvamAI(
        api_subscription_key=SAVRAMAI_API_KEY,
    )
    response = client.chat.completions(
        messages=[
            {
                "role": "user",
                "content": f"You are a summarizer in semantic search engine. Your task is to summarize the following data in context of the query: {query}. Data: {data}. Provide a concise summary that captures the most relevant information to the query. And if data empty then return empty string.",
            }
        ],
        temperature=0.5,
        top_p=1,
        max_tokens=1000,
    )
    return response.choices[0].message.content
