export async function registerRoutes(fastify, collectionManager) {
	fastify.post('/init', async (request, reply) => {
		try {
			await collectionManager.initializeCollection()
			return { success: true, message: 'Collection initialized' }
		} catch (error) {
			reply.status(500)
			return { success: false, error: error.message }
		}
	})

	fastify.get('/search', async (request, reply) => {
		try {
			const { query } = request.query
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

			const count = await collectionManager.addDocuments(documents)
			return { success: true, message: 'Documents added successfully', count }
		} catch (error) {
			reply.status(500)
			return { success: false, error: error.message }
		}
	})

	fastify.get('/health', async () => {
		return { status: 'ok' }
	})
}
