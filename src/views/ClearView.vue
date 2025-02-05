<template>
	<div class="max-w-2xl mx-auto p-4">
		<h1 class="text-2xl font-bold mb-4">Clear ChromaDB Collection</h1>

		<div class="bg-red-50 border border-red-200 rounded p-4 mb-4">
			<p class="text-red-700 mb-4">
				Warning: This action will delete all documents from the collection. This cannot be undone.
			</p>

			<div class="flex items-center mb-4">
				<input type="checkbox" id="confirm" v-model="confirmed" class="mr-2" />
				<label for="confirm"> I understand that this will permanently delete all documents </label>
			</div>

			<button
				@click="clearCollection"
				:disabled="!confirmed"
				class="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
			>
				Clear Collection
			</button>
		</div>

		<div v-if="message" :class="['p-4 rounded', messageClass]">
			{{ message }}
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const confirmed = ref(false)
const message = ref('')
const status = ref('')

const messageClass = computed(() => {
	return status.value === 'success'
		? 'bg-green-50 text-green-700 border border-green-200'
		: 'bg-red-50 text-red-700 border border-red-200'
})

async function clearCollection() {
	if (!confirmed.value) return

	try {
		const response = await fetch('http://localhost:3000/clear', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ confirmed: true })
		})

		const data = await response.json()

		if (data.success) {
			message.value = data.message
			status.value = 'success'
			confirmed.value = false
		} else {
			throw new Error(data.error)
		}
	} catch (error) {
		message.value = `Error: ${error.message}`
		status.value = 'error'
	}
}
</script>
