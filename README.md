# ChromaDB Client

A Vue.js-based web client for managing and interacting with ChromaDB vector database.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Docker](https://www.docker.com/get-started) (for running ChromaDB)
-   [Ollama](https://ollama.ai/) (for local LLM support)
-   Node.js 18+ (LTS recommended)
-   Package manager: npm (comes with Node.js) or [pnpm](https://pnpm.io/installation) (recommended)

## Setup

1. **Install pnpm** (optional but recommended)

    ```bash
    npm install -g pnpm
    ```

2. **Start ChromaDB**

    Run ChromaDB using Docker:

    ```bash
    docker run -p 8000:8000 chromadb/chroma
    ```

3. **Start Ollama**

    First, ensure you have downloaded a model:

    ```bash
    ollama pull llama3.2
    ```

    Ollama will run automatically in the background after installation.

4. **Install Dependencies**

    Using pnpm (recommended):

    ```bash
    pnpm install
    ```

    Or using npm:

    ```bash
    npm install
    ```

5. **Configure Environment**

    Copy the example environment file to create your own:

    ```bash
    cp example.env .env
    ```

    Configure the following variables in `.env`:

    ```env
    # Ollama Configuration
    OLLAMA_BASE_URL=http://localhost:11434
    OLLAMA_CHAT_MODEL=llama3.2       # Or your preferred model
    OLLAMA_EMBEDDING_MODEL=nomic-embed-text

    # ChromaDB Configuration
    CHROMA_COLLECTION_NAME=your-collection-name
    CHROMA_SERVER_URL=http://localhost:8000

    # Server Configuration
    SERVER_PORT=3000
    SERVER_HOST=localhost
    ```

6. **Start the Application**

    Using pnpm:

    ```bash
    pnpm dev
    ```

    Or using npm:

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`

## Features

-   Add documents in ChromaDB collections
-   Perform semantic searches across your documents
-   Clear collections when needed
-   Real-time interaction with local LLMs through Ollama

## Usage

1. **Adding Documents**

    - Navigate to the home page
    - Upload text documents or paste text directly
    - Documents will be processed and stored in ChromaDB

2. **Searching**

    - Use the search page to perform semantic searches
    - Enter your query in natural language
    - View matching results with relevance scores

3. **Managing Collections**
    - View all collections in the collections page
    - Clear collections when needed (warning: this action is irreversible)

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Architecture

-   Frontend: Vue.js with TypeScript
-   Vector Database: ChromaDB
-   LLM Integration: Ollama with LLama3.2
-   Styling: Tailwind CSS

## License

MIT License
