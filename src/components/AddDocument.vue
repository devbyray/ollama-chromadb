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
			<button type="submit" class="btn btn-primary" :disabled="isSubmitting">
				{{ isSubmitting ? 'Adding...' : 'Add Document' }}
			</button>
			<div v-if="message" :class="['alert', message.type === 'error' ? 'alert-danger' : 'alert-success']">
				{{ message.text }}
			</div>
		</form>
	</div>
</template>

<script>
export default {
	name: 'AddDocument',
	data() {
		return {
			content: '',
			isSubmitting: false,
			message: null
		}
	},
	methods: {
		async submitDocument() {
			this.isSubmitting = true
			this.message = null

			try {
				const response = await fetch('/api/document', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ content: this.content })
				})

				const data = await response.json()

				if (data.success) {
					this.message = { type: 'success', text: 'Document added successfully!' }
					this.content = ''
				} else {
					this.message = { type: 'error', text: data.error || 'Failed to add document' }
				}
			} catch (error) {
				this.message = { type: 'error', text: 'Error connecting to server' }
			} finally {
				this.isSubmitting = false
			}
		}
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
