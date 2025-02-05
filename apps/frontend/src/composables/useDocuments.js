import { ref } from 'vue'

export function useDocuments() {
	const documents = ref([])
	const error = ref('')
	const isLoading = ref(false)

	async function addDocument(content) {
		isLoading.value = true
		error.value = ''

		try {
			const response = await fetch('/api/document', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content })
			})

			const data = await response.json()
			if (!data.success) throw new Error(data.error)
			return data
		} catch (e) {
			error.value = e.message || 'Error adding document'
			throw e
		} finally {
			isLoading.value = false
		}
	}

	async function fetchDocuments() {
		isLoading.value = true
		error.value = ''

		try {
			const response = await fetch('/api/documents')
			const data = await response.json()
			if (data.success) {
				documents.value = data.documents
			} else {
				throw new Error(data.error)
			}
		} catch (e) {
			error.value = e.message || 'Failed to fetch documents'
			throw e
		} finally {
			isLoading.value = false
		}
	}

	async function searchDocuments(query) {
		isLoading.value = true
		error.value = ''

		try {
			const response = await fetch('/api/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query })
			})

			const data = await response.json()
			if (!data.success) throw new Error(data.error)
			return data.results
		} catch (e) {
			error.value = e.message || 'Search failed'
			throw e
		} finally {
			isLoading.value = false
		}
	}

	async function chatWithDocuments(query) {
		isLoading.value = true
		error.value = ''

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query })
			})

			const data = await response.json()
			if (!data.success) throw new Error(data.error)
			return {
				response: data.response,
				context: data.context
			}
		} catch (e) {
			error.value = e.message || 'Chat failed'
			throw e
		} finally {
			isLoading.value = false
		}
	}

	return {
		documents,
		error,
		isLoading,
		addDocument,
		fetchDocuments,
		searchDocuments,
		chatWithDocuments
	}
}
