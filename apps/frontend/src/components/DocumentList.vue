<template>
	<div class="py-6 flex flex-col justify-center sm:py-12">
		<div class="relative py-3">
			<div class="relative px-4 py-10 mx-auto p-4 w-full bg-white dark:bg-slate-500 shadow rounded-lg">
				<div class="">
					<h1 class="text-2xl font-bold mb-8 text-center">Documents</h1>

					<div class="space-y-4 grid grid-cols-3 gap-2">
						<div v-if="documents.length === 0" class="text-gray-500 text-center">No documents found</div>

						<div
							v-for="(doc, index) in documents"
							:key="index"
							class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
						>
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
import { onMounted } from 'vue'
import { useDocuments } from '../composables/useDocuments'

const { documents, error, fetchDocuments } = useDocuments()

onMounted(() => {
	fetchDocuments()
})
</script>
