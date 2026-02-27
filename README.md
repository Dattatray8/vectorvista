# VectorVista

## Overview

VectorVista is an intelligent data retrieval and semantic search platform that transforms how you interact with structured data. Upload your JSON datasets or MongoDB exports and query them using natural language—find exactly what you need based on meaning, not just keywords.

## What It Does

VectorVista bridges the gap between traditional keyword-based search and modern semantic understanding. When you upload your data, the platform converts it into vector embeddings—mathematical representations of meaning. This enables intelligent searches that understand context and intent, delivering results based on actual relevance rather than simple pattern matching.

**Key Capabilities:**

- **Smart Data Import** - Upload JSON files or paste MongoDB exports directly with real-time syntax validation
- **Semantic Search** - Query your data using natural language questions and statements
- **Intelligent Retrieval** - Get results ranked by actual relevance to your search intent
- **Session Management** - Work with multiple datasets independently, each tracked with unique session IDs
- **Data Preservation** - Original data structures are maintained alongside processed embeddings

## How It Works

### Architecture

The application operates on a distributed architecture with clear separation of concerns:

**Frontend (Next.js + React)**
- Modern React interface with real-time code editor powered by Monaco
- Responsive design with Tailwind CSS
- Two primary workflows: data parsing and semantic search
- Real-time feedback and error handling with toast notifications

**Backend (Flask + MongoDB)**
- RESTful API handling data ingestion and retrieval
- MongoDB database storing both original data and vector embeddings
- Semantic processing using sentence-transformers
- Session-based isolation for concurrent users

### Data Flow

1. **Upload Phase** - User uploads or pastes JSON/MongoDB data
2. **Normalization** - Raw data is converted to text representation
3. **Embedding Generation** - Text is transformed into semantic vectors using ML models
4. **Storage** - Original data, embeddings, and metadata stored in MongoDB
5. **Search Phase** - User input is converted to vectors and compared against indexed data
6. **Ranking** - Results ranked by semantic similarity to the query
7. **Retrieval** - Matching records returned with relevance scores

## Core Features

### Data Parser
Upload structured data in JSON or MongoDB export format. The built-in editor provides syntax checking and visual feedback. Once processed, your data is ready for semantic search across all records.

### Semantic Search
Query your indexed data using natural language. The search engine understands the meaning behind your words, making it possible to find relevant information even when exact keywords don't match. Results are ranked by semantic relevance.

### Session Management
Each data import creates an isolated session. Multiple datasets can be indexed and searched independently, allowing parallel workflows without data interference.

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Python, Flask, MongoDB
- **ML/NLP**: Sentence Transformers (for vector embeddings), Sarvamai (AI integration)
- **Editor**: Monaco Editor for code editing capabilities
- **API**: REST architecture with CORS support

## Use Cases

- **Data Discovery** - Find relevant records in large datasets through natural language queries
- **Knowledge Exploration** - Search through documentation or exported data using context-aware meaning
- **Semantic Analysis** - Understand relationships and relevance in structured data
- **Research & Analytics** - Query databases with flexible, meaning-based retrieval instead of rigid SQL
