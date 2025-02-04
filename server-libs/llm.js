export class OllamaService {
	constructor(model = 'llama3.2') {
		this.model = model
		this.baseUrl = 'http://localhost:11434'
	}

	async generateResponse(query, context) {
		try {
			const prompt = this.buildPrompt(query, context)
			console.log('prompt:', prompt)
			const response = await fetch(`${this.baseUrl}/api/generate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: this.model,
					prompt,
					stream: false
				})
			})

			if (!response.ok) {
				throw new Error(`Ollama API error: ${response.statusText}`)
			}

			const data = await response.json()
			return data.response
		} catch (error) {
			console.error('LLM generation error:', error)
			throw new Error('Failed to generate response')
		}
	}

	buildPrompt(query, context) {
		const contextText = context.join('\n')
		return `Context information is below.
---------------------
${contextText}
---------------------
Given the context information answer the following question: ${query}.
But don't just answer the question. Provide a explanation or reasoning behind your answer. But keep it short and consise in max 3 paragraphs. Don't tell that you recieved any context.
If the context doesn't contain relevant information to answer the question, say "I don't have enough information to answer that question."`
	}
}
