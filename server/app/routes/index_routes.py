from flask import Blueprint, jsonify, request, Response
from app.db import db
from app.helper import (
    embedding_process,
    generate_session_id,
    get_embedding,
    summarize_data,
)

index_bp = Blueprint("index", __name__)

data_store = {}


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


@index_bp.route("/upload", methods=["POST"])
def upload():
    data = request.get_json()
    session_id = data.get("session_id")
    print(session_id)
    if not session_id or session_id == "undefined":
        session_id = generate_session_id()
        print(session_id)
    data_store[session_id] = data.get("userData", [])
    return jsonify({"session_id": session_id})


@index_bp.route("/embedding/<session_id>")
def embedding(session_id):
    data = data_store.get(session_id)
    response = Response(
        embedding_process(data, session_id), mimetype="text/event-stream"
    )
    response.headers["X-Accel-Buffering"] = "no"  # Critical for Nginx/Vercel
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Connection"] = "keep-alive"
    return response


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
        count = db.data.count_documents({"session_id": session_id})
        if count == 0:
            return (
                jsonify(
                    {"message": "session is expired or no data found", "success": False}
                ),
                404,
            )
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
