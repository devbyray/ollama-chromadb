import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

export const config = {
	ollama: {
		baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
		chatModel: process.env.OLLAMA_CHAT_MODEL || 'llama3.2',
		embeddingModel: process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text'
	},
	chroma: {
		collectionName: process.env.CHROMA_COLLECTION_NAME || 'dev-by-rayray',
		serverUrl: process.env.CHROMA_SERVER_URL || 'http://localhost:8000'
	},
	server: {
		port: parseInt(process.env.SERVER_PORT || '3000'),
		host: process.env.SERVER_HOST || 'localhost'
	}
}
