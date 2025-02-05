# ChromaDB Client

A full-stack application for managing and interacting with ChromaDB vector database.

## Required Tools

-   Node.js 18+
-   Docker
-   PNPM (`npm install -g pnpm`)
-   Ollama ([Download](https://ollama.ai))
-   ChromaDB (via Docker)

## Quick Start

1. **Start Required Services**

```bash
# Start ChromaDB
docker run -d -p 8000:8000 chromadb/chroma

# Download Ollama Models (after installing Ollama)
ollama pull llama3.2
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Configure Environment**

```bash
# Copy example env files
cp apps/backend/example.env apps/backend/.env
cp apps/frontend/example.env apps/frontend/.env
```

4. **Run the Application**

Development mode:

```bash
# Start both frontend and backend
pnpm frontend:dev
pnpm backend:dev
```

Using Docker:

```bash
# Build and start all services
pnpm docker:dev

# Stop all services
docker compose down
```

Visit `http://localhost:5173` to access the application.

## Tech Stack

-   Frontend: Vue.js + Tailwind CSS
-   Backend: Node.js/Express
-   Database: ChromaDB
-   LLM: Ollama (llama3.2)
-   Containerization: Docker
