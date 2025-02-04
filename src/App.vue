<template>
	<div class="min-h-screen bg-gray-100">
		<nav class="bg-white shadow-lg mb-6">
			<div class="max-w-7xl mx-auto px-4">
				<div class="flex justify-center space-x-4 py-4">
					<RouterLink
						to="/"
						class="px-3 py-2 rounded-md text-sm font-medium"
						active-class="bg-blue-600 text-white"
						inactive-class="text-gray-700 hover:bg-gray-50"
					>
						Search
					</RouterLink>
					<RouterLink
						to="/documents"
						class="px-3 py-2 rounded-md text-sm font-medium"
						active-class="bg-blue-600 text-white"
						inactive-class="text-gray-700 hover:bg-gray-50"
					>
						Documents
					</RouterLink>
				</div>
			</div>
		</nav>
		<RouterView />
	</div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
