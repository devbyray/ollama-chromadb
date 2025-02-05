import { OllamaService } from './llm.js'

export async function registerRoutes(fastify, collectionManager) {
	const llmService = new OllamaService()

	fastify.post('/init', async (request, reply) => {
		try {
			await collectionManager.initializeCollection()
			return { success: true, message: 'Collection initialized' }
		} catch (error) {
			reply.status(500)
			return { success: false, error: error.message }
		}
	})

	fastify.post('/search', async (request, reply) => {
		try {
			const { query } = request.body
			if (!query) {
				reply.status(400)
				return { success: false, error: 'Query parameter is required' }
			}
			const results = await collectionManager.retrieveRelevantDocs(query)
			return { success: true, results }
		} catch (error) {
			reply.status(500)
			return { success: false, error: error.message }
		}
	})

	fastify.post('/documents', async (request, reply) => {
		try {
			const { documents } = request.body
			if (!documents || !Array.isArray(documents)) {
				reply.status(400)
				return { success: false, error: 'Documents array is required' }
			}

			// Convert documents to strings if they are objects
			const processedDocs = documents.map(doc => (typeof doc === 'object' ? JSON.stringify(doc) : String(doc)))

			const count = await collectionManager.addDocuments(processedDocs)
			return { success: true, message: 'Documents added successfully', count }
		} catch (error) {
			reply.status(500)
			return { success: false, error: error.message }
		}
	})

	fastify.post('/document', async (request, reply) => {
		try {
			const { content } = request.body
			if (!content) {
				reply.status(400)
				return { success: false, error: 'Content is required' }
			}

			// Convert content to string if it's an object
			const processedContent = typeof content === 'object' ? JSON.stringify(content) : String(content)

			const count = await collectionManager.addDocuments([processedContent])
			return { success: true, message: 'Document added successfully', count }
		} catch (error) {
			reply.status(500)
			return { success: false, error: error.message }
		}
	})

	fastify.get('/documents', async (request, reply) => {
		try {
			const documents = await collectionManager.getAllDocuments()
			return { success: true, documents }
		} catch (error) {
			reply.status(500)
			return { success: false, error: error.message }
		}
	})

	fastify.get('/health', async () => {
		return { status: 'ok' }
	})

	fastify.post('/chat', async (request, reply) => {
		try {
			const { query } = request.body
			if (!query) {
				reply.status(400)
				return { success: false, error: 'Query parameter is required' }
			}

			const context = await collectionManager.retrieveRelevantDocs(query)
			const response = await llmService.generateResponse(query, context)

			return {
				success: true,
				response,
				context
			}
		} catch (error) {
			reply.status(500)
			return { success: false, error: error.message }
		}
	})

	fastify.post('/clear', async (request, reply) => {
		try {
			const { confirmed } = request.body
			if (!confirmed) {
				reply.status(400)
				return { success: false, error: 'Confirmation required' }
			}

			await collectionManager.clearCollection()
			return { success: true, message: 'Collection cleared successfully' }
		} catch (error) {
			reply.status(500)
			return { success: false, error: error.message }
		}
	})
}
