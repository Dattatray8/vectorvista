import json
from google import genai
import uuid
import os
import re
from sarvamai import SarvamAI
from dotenv import load_dotenv
from google.genai import types
from app.db import db
from datetime import datetime

load_dotenv()


def get_embedding(text: str):
    client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))

    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(
            output_dimensionality=768,
        ),
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


SYSTEM_PROMPT = """
You are an AI assistant for semantic data exploration.
You get a user query and a set of retrieved documents from a MongoDB collection.
You task is to provide explanations to user query based on the retrieved documents.
Also undertand retrieved json data and provide key or filed names from json data that are important or related to user query.
Never do all fields of document are important or include in related fields, only include those fields which are important and related to user query.
And also see proper user requirement and provided data if it is not related to it then give a proper message to user that data is not related to user query and also provide the reason why it is not related.
Summarize and explain retrieved MongoDB documents clearly and concisely.

#IMPROTANT
A field is relevant ONLY IF:

1. The field value directly answers the user query
2. The field contains entities mentioned in query
3. Removing the field would reduce answer quality

DO NOT include:
- IDs
- timestamps
- metadata if not related to query
- generic or unneccesory summaries
- unrelated contextual fields

# Maximum 3 related fields according to need or query.

OUTPUT FORMAT:
{
    "summary": "your summary and explanation here",
    "related_fields": ["status", "user_id", "order_id"] # these are sample example to you
}
"""


def clean_response(text):
    # Remove <think>...</think>
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)
    return text.strip()


def summarize_data(data, query: str):
    GEMINI_API_KEY = os.getenv("GENAI_API_KEY")
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", # Use 1.5-flash for better stability
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json" # Forces Gemini to output raw JSON
            ),
            contents=f"Query: {query}\n\nData: {data}",
        )
        
        # Strip potential markdown backticks if they still appear
        clean_text = response.text.strip()
        if clean_text.startswith("```"):
            clean_text = clean_text.split("```")[1]
            if clean_text.startswith("json"):
                clean_text = clean_text[4:]
        
        return json.loads(clean_text)
    
    except Exception as e:
        print(f"Gemini/Parsing Error: {e}")
        # Return a fallback JSON object so the backend doesn't crash
        return {
            "summary": "Could not generate summary due to a formatting error.",
            "related_fields": []
        }
    # SAVRAMAI_API_KEY = os.getenv("SARVAMAI_API_KEY")
    # client = SarvamAI(
    #     api_subscription_key=SAVRAMAI_API_KEY,
    # )
    # response = client.chat.completions(
    #     messages=[
    #         {
    #             "role": "system",
    #             "content": SYSTEM_PROMPT,
    #         },
    #         {
    #             "role": "user",
    #             "content": f"Query: {query}\n\nData: {data}",
    #         },
    #     ],
    #     temperature=0.5,
    #     top_p=1,
    #     max_tokens=1000,
    # )
    # output = response.choices[0].message.content
    # return clean_response(output)
    GEMINI_API_KEY = os.getenv("GENAI_API_KEY")
    client = genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT
        ),
        contents=f"Query: {query}\n\nData: {data}",
    )
    print("response from gemini: ", response.text)
    return json.loads(response.text)


def embedding_process(data, session_id):
    cnt = 1
    obj = data
    data_length = len(obj)
    if not obj:
        yield f"data: {json.dumps({'type':'message', 'message': 'No data provided'})}\n\n"
        return
    if not session_id:
        yield f"data: {json.dumps({'type':'message', 'message': 'No session_id provided'})}\n\n"
        return
    else:
        db.data.delete_many({"session_id": session_id})
    for ob in obj:
        normalized_data = normalize_json_to_text(ob)
        embedding = get_embedding(normalized_data)
        db.data.insert_one(
            {
                "session_id": session_id,
                "embedding": embedding,
                "original_data": ob,
                "normalized_data": normalized_data,
                "created_at": datetime.utcnow(),
            }
        )
        yield f"data: {json.dumps({'type':'progress', 'percentage': int(cnt/data_length*100)})}\n\n"
        cnt += 1
    yield f"data: {json.dumps({'type':'message', 'message': 'Data Prepared Successfully'})}\n\n"
