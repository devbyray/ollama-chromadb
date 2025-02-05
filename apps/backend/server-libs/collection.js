import { ChromaClient } from 'chromadb'
import { DocumentProcessorFactory } from './documentProcessors.js'
import { config } from './config.js'

export const sampleDocs = [
	'JavaScript is a high-level programming language primarily used for web development.',
	'React is a JavaScript library for building user interfaces maintained by Facebook.',
	'Node.js is a runtime environment that executes JavaScript code outside a web browser.',
	'TypeScript adds static typing to JavaScript to help catch errors early in development.',
	'Git is a distributed version control system for tracking changes in source code.'
]

export function validateArrays(ids, embeddings, documents, metadatas) {
	console.log('Validating arrays:')
	console.log('IDs:', ids)
	console.log('Embeddings:', {
		isArray: Array.isArray(embeddings),
		length: embeddings?.length,
		firstItem: embeddings?.[0]?.slice(0, 3),
		firstItemLength: embeddings?.[0]?.length
	})
	console.log('Documents:', documents)
	console.log('Metadatas:', JSON.stringify(metadatas, null, 2))

	if (!Array.isArray(embeddings) || !embeddings.every(e => Array.isArray(e))) {
		throw new Error('Embeddings must be an array of arrays')
	}
	return true
}

const CHUNK_SIZE = 500 // characters per chunk
const CHUNK_OVERLAP = 50 // overlap between chunks

function splitIntoChunks(text) {
	const chunks = []
	let startIndex = 0

	while (startIndex < text.length) {
		let endIndex = startIndex + CHUNK_SIZE

		// If we're not at the end of the text, try to find a natural break point
		if (endIndex < text.length) {
			const nextPeriod = text.indexOf('.', endIndex - CHUNK_OVERLAP)
			const nextNewline = text.indexOf('\n', endIndex - CHUNK_OVERLAP)

			if (nextPeriod !== -1 && nextPeriod < endIndex + CHUNK_OVERLAP) {
				endIndex = nextPeriod + 1
			} else if (nextNewline !== -1 && nextNewline < endIndex + CHUNK_OVERLAP) {
				endIndex = nextNewline + 1
			}
		}

		chunks.push(text.slice(startIndex, endIndex).trim())
		startIndex = endIndex - CHUNK_OVERLAP
	}

	return chunks
}

export class CollectionManager {
	constructor(embeddingFunction) {
		this.client = new ChromaClient({ path: config.chroma.serverUrl })
		this.embedder = embeddingFunction
		this.collectionName = config.chroma.collectionName
	}

	async initializeCollection() {
		try {
			const collections = await this.client.listCollections()
			const exists = collections.find(c => c.name === this.collectionName)

			if (!exists) {
				console.log('Creating new collection...')
				const collection = await this.client.getOrCreateCollection({
					name: this.collectionName,
					embeddingFunction: this.embedder
				})

				console.log('Generating embeddings...')
				const embeddings = await this.embedder.generate(sampleDocs)

				const ids = sampleDocs.map((_, i) => `doc${i}`)
				const metadatas = sampleDocs.map(() => ({
					source: 'programming-guide',
					timestamp: new Date().toISOString()
				}))

				validateArrays(ids, embeddings, sampleDocs, metadatas)

				await collection.add({
					ids,
					embeddings,
					documents: sampleDocs,
					metadatas
				})

				console.log('Collection initialized with sample documents')
				return collection
			}

			console.log('Collection already exists')
			return await this.client.getCollection({
				name: this.collectionName,
				embeddingFunction: this.embedder
			})
		} catch (err) {
			console.error('Error initializing collection:', err)
			throw err
		}
	}

	async retrieveRelevantDocs(query) {
		const collection = await this.client.getCollection({
			name: this.collectionName,
			embeddingFunction: this.embedder
		})

		const results = await collection.query({
			queryTexts: [query],
			nResults: 3,
			minScore: 0.9,
			include: ['documents', 'metadatas']
		})

		console.log('Query results:', results?.metadatas)

		return results.documents[0]
	}

	async addDocuments(documents, type = 'plain') {
		const collection = await this.client.getCollection({
			name: this.collectionName,
			embeddingFunction: this.embedder
		})

		const processor = DocumentProcessorFactory.getProcessor(type)
		let allChunks = []
		let allIds = []
		let allMetadatas = []

		// Process each document
		for (let docIndex = 0; docIndex < documents.length; docIndex++) {
			const { content, metadata } = await processor.process(documents[docIndex])
			const chunks = splitIntoChunks(content)
			allChunks.push(...chunks)

			// Create IDs and metadata for each chunk
			chunks.forEach((_, chunkIndex) => {
				const id = `doc${Date.now()}_${docIndex}_chunk${chunkIndex}`
				allIds.push(id)
				allMetadatas.push({
					...metadata,
					documentIndex: docIndex,
					chunkIndex: chunkIndex,
					totalChunks: chunks.length
				})
			})
		}

		const embeddings = await this.embedder.generate(allChunks)
		validateArrays(allIds, embeddings, allChunks, allMetadatas)

		await collection.add({
			ids: allIds,
			embeddings,
			documents: allChunks,
			metadatas: allMetadatas
		})

		return documents.length
	}

	async getAllDocuments() {
		try {
			const collection = await this.client.getCollection({
				name: this.collectionName,
				embeddingFunction: this.embedder
			})

			const result = await collection.get()
			return result.documents || []
		} catch (error) {
			console.error('Error getting all documents:', error)
			throw error
		}
	}

	async clearCollection() {
		try {
			// Delete the entire collection using the client's deleteCollection method
			await this.client.deleteCollection({
				name: this.collectionName
			})

			// Reinitialize an empty collection
			await this.initializeCollection()
			return true
		} catch (error) {
			console.error('Error clearing collection:', error)
			throw error
		}
	}
}
