from google import genai
import uuid
import os
from sarvamai import SarvamAI
from dotenv import load_dotenv
from google.genai import types

load_dotenv()

def get_embedding(text: str):
    client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))
    
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(
            output_dimensionality=768,
        )
    )
    
    return result.embeddings[0].values
    


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


def summarize_data(data, query: str):
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
