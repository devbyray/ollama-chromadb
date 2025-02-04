import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import DocumentsView from '../views/DocumentsView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'search',
			component: SearchView
		},
		{
			path: '/documents',
			name: 'documents',
			component: DocumentsView
		}
	]
})

export default router
