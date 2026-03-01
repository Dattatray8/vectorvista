from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    from .routes.index_routes import index_bp
    app.register_blueprint(index_bp, url_prefix='/api/v1')
    print("Server started successfully.")
    return app