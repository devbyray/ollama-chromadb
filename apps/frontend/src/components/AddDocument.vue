<template>
	<div class="add-document">
		<h2 class="text-2xl mb-8">Add New Document</h2>
		<form @submit.prevent="submitDocument">
			<div class="form-group">
				<textarea
					v-model="content"
					class="form-control"
					rows="6"
					placeholder="Enter document content..."
					required
				></textarea>
			</div>
			<button type="submit" class="btn btn-primary" :disabled="isLoading">
				{{ isLoading ? 'Adding...' : 'Add Document' }}
			</button>
			<div v-if="message" :class="['alert', message.type === 'error' ? 'alert-danger' : 'alert-success']">
				{{ message.text }}
			</div>
		</form>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useDocuments } from '../composables/useDocuments'

const { addDocument, error: apiError, isLoading } = useDocuments()
const content = ref('')
const message = ref(null)

async function submitDocument() {
	if (!content.value) return

	try {
		await addDocument(content.value)
		message.value = { type: 'success', text: 'Document added successfully!' }
		content.value = ''
	} catch (error) {
		message.value = { type: 'error', text: apiError.value || 'Error adding document' }
	}
}
</script>

<style scoped>
@reference "tailwindcss";

.add-document {
	@apply mx-auto p-4 max-w-2xl w-full bg-white dark:bg-slate-500 shadow rounded-lg;
}

.form-group {
	@apply mb-4;
}

.form-control {
	@apply w-full p-2;
}

textarea {
	@apply block w-full p-2 border bg-gray-50 dark:bg-slate-500 rounded resize-y;
}

.btn {
	@apply px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer;
}

.btn:disabled {
	@apply bg-gray-400 cursor-not-allowed;
}

.alert {
	@apply mt-4 p-3 rounded;
}

.alert-success {
	@apply bg-green-100 text-green-700;
}

.alert-danger {
	@apply bg-red-100 text-red-700;
}
</style>
