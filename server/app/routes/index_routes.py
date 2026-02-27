from flask import Blueprint, jsonify, request
from app.db import db
from datetime import datetime
from app.helper import get_embedding, normalize_json_to_text, generate_session_id, summarize_data

index_bp = Blueprint("index", __name__)

@index_bp.route("/")
def index():
    return jsonify({"message": "Welcome to the VectorVista API!"})


@index_bp.route("/test-db")
def test_db():
    try:
        collections = db.list_collection_names()
        return jsonify({"database_connected": True, "collections": collections})
    except Exception as e:
        return jsonify({"database_connected": False, "error": str(e)}), 500


@index_bp.route("/embedding", methods=["POST"])
def embedding():
    data = request.get_json()
    obj = data.get("userData")
    session_id = data.get("session_id")
    if not obj:
        return jsonify({"message": "No userData provided"}), 400
    if not session_id:
        session_id = generate_session_id()
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
                "created_at": datetime.utcnow()
            }
        )
    return jsonify({"message": "Data Prepared Successfully", "session_id": session_id})


@index_bp.route("/search", methods=["POST"])
def search():
    try:
        data = request.get_json()
        query = data.get("query")
        limit = data.get("limit", 5)
        session_id = data.get("session_id")
        if not query:
            return jsonify({"message": "query is empty", "success": False}), 400
        if not session_id:
            return jsonify({"message": "session not found", "success": False}), 404
        query_embedding = get_embedding(query)
        results = db.data.aggregate(
            [
                {
                    "$vectorSearch": {
                        "index": "vector_index",
                        "path": "embedding",
                        "queryVector": query_embedding,
                        "numCandidates": 100,
                        "limit": limit,
                        "filter": {"session_id": session_id},
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "original_data": 1,
                        "normalized_data": 1,
                        "score": {"$meta": "vectorSearchScore"},
                    }
                },
            ]
        )
        data = [doc["original_data"] for doc in results]
        summary = summarize_data(data, query)
        return (
            jsonify(
                {
                    "results": data,
                    "summary": summary,
                    "success": True,
                    "message": "Search completed successfully",
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {"success": False, "message": "Failed to search data", "error": str(e)}
            ),
            500,
        )
