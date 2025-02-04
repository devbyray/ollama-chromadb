import { ChromaClient } from 'chromadb'

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

export class CollectionManager {
	constructor(embeddingFunction) {
		this.client = new ChromaClient()
		this.embedder = embeddingFunction
	}

	async initializeCollection() {
		try {
			const collections = await this.client.listCollections()
			const exists = collections.find(c => c.name === 'dev-by-rayray')

			if (!exists) {
				console.log('Creating new collection...')
				const collection = await this.client.getOrCreateCollection({
					name: 'dev-by-rayray',
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
				name: 'dev-by-rayray',
				embeddingFunction: this.embedder
			})
		} catch (err) {
			console.error('Error initializing collection:', err)
			throw err
		}
	}

	async retrieveRelevantDocs(query) {
		const collection = await this.client.getCollection({
			name: 'dev-by-rayray',
			embeddingFunction: this.embedder
		})

		const results = await collection.query({
			queryTexts: [query],
			nResults: 2
		})

		return results.documents[0]
	}

	async addDocuments(documents) {
		const collection = await this.client.getCollection({
			name: 'dev-by-rayray',
			embeddingFunction: this.embedder
		})

		const ids = documents.map((_, i) => `doc${Date.now()}_${i}`)
		const metadatas = documents.map(() => ({
			source: 'api-input',
			timestamp: new Date().toISOString()
		}))

		const embeddings = await this.embedder.generate(documents)

		validateArrays(ids, embeddings, documents, metadatas)

		await collection.add({
			ids,
			embeddings,
			documents,
			metadatas
		})

		return documents.length
	}
}
