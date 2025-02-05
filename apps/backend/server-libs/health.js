import { config } from './config.js'
import { ChromaClient } from 'chromadb'

export class HealthService {
	constructor() {
		this.chromaClient = new ChromaClient({
			path: config.chroma.serverUrl
		})
	}

	async checkServices() {
		const health = {
			backend: { status: 'ok', message: 'Backend is running' },
			chroma: { status: 'error', message: 'Not connected' },
			ollama: {
				status: 'error',
				message: 'Not connected',
				models: {
					chat: { status: 'error', message: `${config.ollama.chatModel} not found` },
					embedding: { status: 'error', message: `${config.ollama.embeddingModel} not found` }
				}
			}
		}

		// Check ChromaDB
		try {
			await this.chromaClient.listCollections()
			health.chroma = { status: 'ok', message: 'Connected to ChromaDB' }
		} catch (error) {
			health.chroma = { status: 'error', message: error.message }
		}

		// Check Ollama
		try {
			const ollamaResponse = await fetch(`${config.ollama.baseUrl}/api/tags`)
			if (ollamaResponse.ok) {
				health.ollama.status = 'ok'
				health.ollama.message = 'Connected to Ollama'

				const { models } = await ollamaResponse.json()
				const availableModels = models.map(m => m.name?.split(':')?.at(0))

				// Check chat model
				if (availableModels.includes(config.ollama.chatModel)) {
					health.ollama.models.chat = {
						status: 'ok',
						message: `${config.ollama.chatModel} available`
					}
				}

				// Check embedding model
				if (availableModels.includes(config.ollama.embeddingModel)) {
					health.ollama.models.embedding = {
						status: 'ok',
						message: `${config.ollama.embeddingModel} available`
					}
				}
			}
		} catch (error) {
			health.ollama = {
				status: 'error',
				message: 'Failed to connect to Ollama',
				models: {
					chat: { status: 'error', message: 'Ollama not available' },
					embedding: { status: 'error', message: 'Ollama not available' }
				}
			}
		}

		return health
	}
}
