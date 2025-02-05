import { ref } from 'vue'

export function useCollection() {
	const isLoading = ref(false)
	const error = ref(null)

	const initializeCollection = async () => {
		isLoading.value = true
		error.value = null

		try {
			const response = await fetch('/api/init', {
				method: 'POST'
			})
			const data = await response.json()
			if (!data.success) {
				throw new Error(data.error)
			}
			return data
		} catch (err) {
			error.value = err.message
			throw err
		} finally {
			isLoading.value = false
		}
	}

	return {
		isLoading,
		error,
		initializeCollection
	}
}
