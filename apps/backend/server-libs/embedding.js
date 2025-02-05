import { exec } from 'child_process'
import { promisify } from 'util'
import { Ollama } from 'ollama'
import { config } from './config.js'

const execAsync = promisify(exec)

export class OllamaEmbeddingFunction {
	constructor() {
		this.ollama = new Ollama({ baseUrl: config.ollama.baseUrl })
	}

	async checkModelAvailability(modelName) {
		try {
			// Check CLI
			const { stdout } = await execAsync('ollama list')
			const cliModels = stdout
				.toString()
				.split('\n')
				.filter(line => line.trim())
				.map(line => line.split(/\s+/)[0])
				.filter(name => name !== 'NAME')

			// Check API
			const apiResponse = await fetch('http://localhost:11434/api/tags')
			const apiData = await apiResponse.json()
			const apiModels = apiData.models?.map(m => m.name) || []

			console.log('Checking model availability for:', modelName)
			console.log('Models available via CLI:', cliModels)
			console.log('Models available via API:', apiModels)

			return {
				modelInCli: cliModels.includes(modelName),
				modelInApi: apiModels.includes(modelName),
				availableModels: apiModels
			}
		} catch (error) {
			console.error('Error checking model availability:', error)
			return { modelInCli: false, modelInApi: false, availableModels: [] }
		}
	}

	sanitizeText(text) {
		if (typeof text !== 'string') {
			text = String(text)
		}
		// Remove null characters and other problematic characters
		text = text
			.replace(/\0/g, '')
			.replace(/^\s+|\s+$/g, '') // trim whitespace
			.replace(/[\r\n]+/g, ' ') // replace newlines with spaces

		// Ensure text isn't empty and has reasonable length
		if (!text) {
			text = ' ' // provide minimal valid input
		}
		// Limit text length if needed (adjust limit as needed)
		const maxLength = 8192
		if (text.length > maxLength) {
			text = text.substring(0, maxLength)
		}
		return text
	}

	async generate(texts) {
		const modelName = config.ollama.embeddingModel
		try {
			const { modelInApi } = await this.checkModelAvailability(modelName)

			if (!modelInApi) {
				console.log(`Installing ${modelName} model...`)
				await this.ollama.pull({ model: modelName })
			}

			console.log(`Using model: ${modelName}`)

			const embeddings = await Promise.all(
				texts.map(async text => {
					try {
						const sanitizedText = this.sanitizeText(text)
						const embedding = await this.generateEmbedding(sanitizedText)
						return embedding
					} catch (error) {
						console.error('Error generating individual embedding:', error)
						throw error
					}
				})
			)

			return embeddings
		} catch (error) {
			console.error('Embedding generation error:', error)
			throw error
		}
	}

	async generateEmbedding(text) {
		try {
			const response = await fetch(`${config.ollama.baseUrl}/api/embeddings`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: config.ollama.embeddingModel,
					prompt: text
				})
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()

			// Ollama returns embeddings in the 'embedding' field
			if (!data.embedding || !Array.isArray(data.embedding)) {
				throw new Error('Invalid embedding response format from Ollama')
			}

			return data.embedding
		} catch (error) {
			console.error('Error generating embedding:', error)
			throw error
		}
	}
}
