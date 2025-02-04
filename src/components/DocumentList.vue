<template>
	<div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
		<div class="relative py-3 sm:max-w-xl sm:mx-auto">
			<div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
				<div class="max-w-2xl mx-auto">
					<h1 class="text-2xl font-bold mb-8 text-center">Documents</h1>

					<div class="space-y-4">
						<div v-if="documents.length === 0" class="text-gray-500 text-center">No documents found</div>

						<div v-for="(doc, index) in documents" :key="index" class="p-4 bg-gray-50 rounded-lg">
							<p class="whitespace-pre-wrap">{{ doc }}</p>
						</div>
					</div>

					<div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
						{{ error }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const documents = ref([])
const error = ref('')

async function fetchDocuments() {
	try {
		const response = await fetch('/api/documents')
		const data = await response.json()
		if (data.success) {
			documents.value = data.documents
		} else {
			error.value = data.error || 'Failed to fetch documents'
		}
	} catch (e) {
		error.value = 'Failed to fetch documents'
	}
}

onMounted(() => {
	fetchDocuments()
})
</script>
