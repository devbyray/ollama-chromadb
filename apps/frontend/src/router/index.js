import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import DocumentsView from '../views/DocumentsView.vue'
import StartScreen from '../views/StartScreen.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'start',
			component: StartScreen
		},
		{
			path: '/search',
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
