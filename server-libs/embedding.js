import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export class OllamaEmbeddingFunction {
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

	async generate(texts) {
		const modelCandidates = ['nomic-embed-text:latest', 'llama3.2:latest', 'llama3.1:latest']
		let selectedModel = null
		let availableModels = []

		for (const modelName of modelCandidates) {
			const { modelInApi, availableModels: models } = await this.checkModelAvailability(modelName)
			availableModels = models
			if (modelInApi) {
				selectedModel = modelName
				break
			}
		}

		if (!selectedModel) {
			throw new Error(`No suitable embedding model found. Available models: ${availableModels.join(', ')}`)
		}

		console.log(`Using model: ${selectedModel}`)

		try {
			const embeddings = await Promise.all(
				texts.map(async text => {
					try {
						const response = await fetch('http://localhost:11434/api/embeddings', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								model: selectedModel,
								prompt: text
							})
						})

						if (!response.ok) {
							throw new Error(`Failed to generate embedding: ${response.statusText}`)
						}

						const data = await response.json()
						if (!data.embedding || !Array.isArray(data.embedding)) {
							throw new Error('Invalid embedding response from Ollama')
						}
						return data.embedding
					} catch (error) {
						console.error('Error generating embedding:', error)
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
}
