import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import Fastify from 'fastify'
import FastifyCors from '@fastify/cors'
import { OllamaEmbeddingFunction } from './server-libs/embedding.js'
import { CollectionManager } from './server-libs/collection.js'
import { registerRoutes } from './server-libs/routes.js'
import { config } from './server-libs/config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fastify = Fastify({ logger: true })

// Register CORS
await fastify.register(FastifyCors, {
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
			port: config.server.port || 3000,
			host: '0.0.0.0' // Changed back to 0.0.0.0 for Docker
		})
		console.log(`Server listening at http://localhost:${config.server.port}`)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()
