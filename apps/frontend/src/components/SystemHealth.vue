<template>
	<div class="system-health">
		<div class="flex flex-row gap-4 items-center justify-center">
			<button @click="toggleModels" class="flex items-center gap-2 justify-center">
				<h2 class="text-sm font-bold mb-4">System Status</h2>
			</button>
			<!-- Backend Status -->
			<div class="status-item" :class="getStatusClass(health.backend.status)">
				<span class="status-icon">{{ getStatusIcon(health.backend.status) }}</span>
				<span class="status-text">Backend: {{ health.backend.message }}</span>
			</div>

			<!-- ChromaDB Status -->
			<div class="status-item" :class="getStatusClass(health.chroma.status)">
				<span class="status-icon">{{ getStatusIcon(health.chroma.status) }}</span>
				<span class="status-text">ChromaDB: {{ health.chroma.message }}</span>
			</div>

			<!-- Ollama Status -->
			<div class="status-item" :class="getStatusClass(health.ollama.status)">
				<span class="status-icon">{{ getStatusIcon(health.ollama.status) }}</span>
				<span class="status-text">Ollama: {{ health.ollama.message }}</span>

				<div class="ml-4 mt-2" v-if="health.ollama.status === 'ok' && showModels">
					<!-- Chat Model Status -->
					<div class="" :class="getStatusClass(health.ollama.models.chat.status)">
						<span class="status-icon">{{ getStatusIcon(health.ollama.models.chat.status) }}</span>
						<span class="status-text">Chat Model: {{ health.ollama.models.chat.message }}</span>
					</div>

					<!-- Embedding Model Status -->
					<div class="" :class="getStatusClass(health.ollama.models.embedding.status)">
						<span class="status-icon">{{ getStatusIcon(health.ollama.models.embedding.status) }}</span>
						<span class="status-text">Embedding Model: {{ health.ollama.models.embedding.message }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const health = ref({
	backend: { status: 'error', message: 'Checking...' },
	chroma: { status: 'error', message: 'Checking...' },
	ollama: {
		status: 'error',
		message: 'Checking...',
		models: {
			chat: { status: 'error', message: 'Checking...' },
			embedding: { status: 'error', message: 'Checking...' }
		}
	}
})

const getStatusClass = status => {
	return {
		'bg-green-800 border-green-500': status === 'ok',
		'bg-red-800 border-red-500': status === 'error'
	}
}

const showModels = ref(false)

function toggleModels() {
	showModels.value = !showModels.value
}

const getStatusIcon = status => {
	return status === 'ok' ? '✓' : '⚠️'
}

const checkHealth = async () => {
	try {
		const response = await fetch('/api/health')
		health.value = await response.json()
		console.log(health.value)
	} catch (error) {
		console.error('Failed to check health:', error)
	}
}

onMounted(() => {
	checkHealth()
	// Check health every 30 seconds
	setInterval(checkHealth, 30000)
})
</script>

<style scoped>
@reference "tailwindcss";

.system-health {
	@apply p-2 bg-gray-800 text-white shadow w-full;
}

.status-item {
	@apply p-1 rounded-full border flex items-center gap-2;
}

.status-icon {
	@apply text-xl;
}

.status-text {
	@apply font-medium;
}
</style>
