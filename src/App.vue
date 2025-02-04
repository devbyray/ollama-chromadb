<template>
	<div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
		<div class="relative py-3 sm:max-w-xl sm:mx-auto">
			<div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
				<div class="max-w-md mx-auto">
					<div class="divide-y divide-gray-200">
						<div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
							<h1 class="text-2xl font-bold mb-8 text-center">Document Search</h1>
							<div class="relative">
								<input
									type="text"
									v-model="query"
									@keyup.enter="searchDocuments"
									class="peer w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 placeholder-transparent"
									placeholder="Enter your search query"
								/>
								<label
									class="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
								>
									Enter your search query
								</label>
							</div>
							<button
								@click="searchDocuments"
								class="mt-8 w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
							>
								Search
							</button>

							<div v-if="results.length" class="mt-8 space-y-4">
								<h2 class="text-xl font-semibold">Results:</h2>
								<div v-for="(result, index) in results" :key="index" class="p-4 bg-gray-50 rounded-lg">
									{{ result }}
								</div>
							</div>

							<div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
								{{ error }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const query = ref('')
const results = ref([])
const error = ref('')

async function searchDocuments() {
	if (!query.value.trim()) return

	try {
		error.value = ''
		const response = await fetch(`/api/search?query=${encodeURIComponent(query.value)}`)
		const data = await response.json()

		if (data.success) {
			results.value = data.results
		} else {
			error.value = data.error || 'An error occurred while searching'
		}
	} catch (e) {
		error.value = 'Failed to fetch results'
	}
}
</script>
