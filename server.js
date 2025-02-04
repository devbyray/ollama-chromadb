import Fastify from 'fastify'
import { OllamaEmbeddingFunction } from './server-libs/embedding.js'
import { CollectionManager } from './server-libs/collection.js'
import { registerRoutes } from './server-libs/routes.js'

const fastify = Fastify({ logger: true })
const embedder = new OllamaEmbeddingFunction()
const collectionManager = new CollectionManager(embedder)

// Register routes
await registerRoutes(fastify, collectionManager)

// Start the server
const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' })
		console.log('Server running at http://localhost:3000')
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()
