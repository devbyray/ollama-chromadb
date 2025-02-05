import 'dotenv/config'

export const config = {
	server: {
		port: process.env.SERVER_PORT || 3000,
		host: process.env.SERVER_HOST || '0.0.0.0'
	},
	ollama: {
		baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
		chatModel: process.env.OLLAMA_CHAT_MODEL || 'llama2',
		embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text'
	},
	chroma: {
		collectionName: process.env.CHROMA_COLLECTION_NAME || 'documents',
		serverUrl: process.env.CHROMA_SERVER_URL || 'http://localhost:8000'
	}
}

export default config
