<template>
	<div class="min-h-screen bg-gray-100 dark:bg-slate-700 dark:text-white relative">
		<SystemHealth class="" />

		<nav class="bg-white dark:bg-slate-900 shadow-lg mb-6">
			<div class="max-w-7xl mx-auto px-4">
				<div class="flex justify-center space-x-4 py-4">
					<RouterLink
						to="/"
						class="px-3 py-2 rounded-md text-sm font-medium"
						active-class="bg-blue-600 text-white"
						inactive-class="text-gray-700 hover:bg-gray-50"
					>
						Home
					</RouterLink>
					<RouterLink
						to="/chat"
						class="px-3 py-2 rounded-md text-sm font-medium"
						active-class="bg-blue-600 text-white"
						inactive-class="text-gray-700 hover:bg-gray-50"
					>
						Chat
					</RouterLink>
					<RouterLink
						to="/documents"
						class="px-3 py-2 rounded-md text-sm font-medium"
						active-class="bg-blue-600 text-white"
						inactive-class="text-gray-700 hover:bg-gray-50"
					>
						Documents
					</RouterLink>
					<RouterLink
						to="/add-document"
						class="px-3 py-2 rounded-md text-sm font-medium"
						active-class="bg-blue-600 text-white"
						inactive-class="text-gray-700 hover:bg-gray-50"
					>
						Add Document
					</RouterLink>
					<RouterLink
						to="/clear"
						class="px-3 py-2 rounded-md text-sm font-medium"
						active-class="bg-red-600 text-white"
						inactive-class="text-gray-700 hover:bg-gray-50"
					>
						Clear Collection
					</RouterLink>
				</div>
			</div>
		</nav>
		<div class="container mx-auto p-4">
			<RouterView />
		</div>
	</div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import SystemHealth from './components/SystemHealth.vue'
</script>
