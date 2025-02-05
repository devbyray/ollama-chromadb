<template>
	<div class="add-document">
		<h2>Add New Document</h2>
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
.add-document {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}
.form-group {
	margin-bottom: 1rem;
}
.form-control {
	width: 100%;
	padding: 0.5rem;
}
.btn {
	padding: 0.5rem 1rem;
	background-color: #007bff;
	color: white;
	border: none;
	cursor: pointer;
}
.btn:disabled {
	background-color: #ccc;
}
.alert {
	margin-top: 1rem;
	padding: 0.75rem;
	border-radius: 4px;
}
.alert-success {
	background-color: #d4edda;
	color: #155724;
}
.alert-danger {
	background-color: #f8d7da;
	color: #721c24;
}
</style>
