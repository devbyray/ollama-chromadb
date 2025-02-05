<template>
	<div class="start-screen">
		<h1 class="text-4xl font-black">Welcome to ChromaDB Client</h1>
		<p>Initialize your collection to get started</p>
		<button @click="handleInitialize" :disabled="isLoading" class="init-button">
			{{ isLoading ? 'Initializing...' : 'Initialize Collection' }}
		</button>
		<p v-if="error" class="error">{{ error }}</p>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCollection } from '../composables/useCollection'

const router = useRouter()
const { initializeCollection, isLoading, error } = useCollection()

const handleInitialize = async () => {
	try {
		await initializeCollection()
		router.push('/add-document')
	} catch (err) {
		// Error is already handled by the composable
	}
}
</script>

<style scoped>
.start-screen {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 5rem;
	gap: 2rem;
}

.init-button {
	padding: 0.75rem 1.5rem;
	font-size: 1.1rem;
	background-color: #4caf50;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s;
}

.init-button:disabled {
	background-color: #cccccc;
	cursor: not-allowed;
}

.init-button:hover:not(:disabled) {
	background-color: #45a049;
}

.error {
	color: #ff4444;
	margin-top: 1rem;
}
</style>
