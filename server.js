import Fastify from 'fastify'
import cors from '@fastify/cors'
import { OllamaEmbeddingFunction } from './server-libs/embedding.js'
import { CollectionManager } from './server-libs/collection.js'
import { registerRoutes } from './server-libs/routes.js'

const fastify = Fastify({ logger: true })

// Register CORS
await fastify.register(cors, {
	origin: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

const embedder = new OllamaEmbeddingFunction()
const collectionManager = new CollectionManager(embedder)

// Register routes
await registerRoutes(fastify, collectionManager)

// Start the server
const start = async () => {
	try {
		await fastify.listen({
			port: 3000,
			host: 'localhost' // Changed from 0.0.0.0 to localhost
		})
		console.log('Server running at http://localhost:3000')
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()
