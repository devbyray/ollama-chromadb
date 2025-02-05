<template>
	<div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
		<div class="relative py-3 sm:max-w-xl sm:mx-auto">
			<div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
				<div class="max-w-2xl mx-auto">
					<div class="divide-y divide-gray-200">
						<div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
							<h1 class="text-2xl font-bold mb-8 text-center">Document Search</h1>
							<div class="relative">
								<label class="text-gray-600 text-sm"> Enter your search query </label>
								<input
									type="text"
									v-model="query"
									@keyup.enter="handleSearch"
									class="peer w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
									placeholder="Enter your search query"
									:disabled="isLoading"
								/>
							</div>
							<div class="flex space-x-2">
								<button
									@click="handleSearch"
									class="mt-8 w-1/2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
									:disabled="isLoading"
								>
									Search
								</button>
								<button
									@click="handleChat"
									class="mt-8 w-1/2 bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700"
									:disabled="isLoading"
								>
									Chat
								</button>
							</div>

							<div v-if="chatResponse" class="mt-8 space-y-4">
								<h2 class="text-xl font-semibold">Answer:</h2>
								<div class="p-4 bg-green-50 rounded-lg whitespace-pre-wrap">{{ chatResponse }}</div>

								<h3 class="text-lg font-semibold">Context Used:</h3>
								<div v-for="(doc, index) in context" :key="index" class="p-4 bg-gray-50 rounded-lg">
									{{ doc }}
								</div>
							</div>

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
import { useDocuments } from '../composables/useDocuments'

const query = ref('')
const results = ref([])
const chatResponse = ref('')
const context = ref([])
const { searchDocuments, chatWithDocuments, error, isLoading } = useDocuments()

async function handleSearch() {
	if (!query.value || isLoading.value) return

	results.value = []
	chatResponse.value = ''
	context.value = []

	try {
		results.value = await searchDocuments(query.value)
	} catch (e) {
		console.error('Search error:', e)
	}
}

async function handleChat() {
	if (!query.value || isLoading.value) return

	results.value = []
	chatResponse.value = ''
	context.value = []

	try {
		const response = await chatWithDocuments(query.value)
		chatResponse.value = response.response
		context.value = response.context
	} catch (e) {
		console.error('Chat error:', e)
	}
}
</script>
