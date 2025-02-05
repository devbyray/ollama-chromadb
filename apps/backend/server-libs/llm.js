import { Ollama } from 'ollama'
import { config } from './config.js'

export class OllamaService {
	constructor() {
		this.model = config.ollama.chatModel
		this.ollama = new Ollama({ baseUrl: config.ollama.baseUrl })
	}

	async generateResponse(query, context) {
		try {
			const prompt = this.buildPrompt(query, context)
			console.log('prompt:', prompt)

			const response = await this.ollama.generate({
				model: this.model,
				prompt
			})

			return response.response
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
Don't tell that you recieved any context. 
Don't tell based on the given context.
Don't say "Based on my general knowledge, I can provide an answer."
But don't just answer the question. 
Not just anwswer the question, but provide a explanation. 
Keep it short and consise in max 3 paragraphs. 

If the context doesn't contain relevant information to answer the question, say "I don't have enough information to answer that question."`
	}
}
