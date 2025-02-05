import { createRouter, createWebHistory } from 'vue-router'
import SearchAndChat from './components/SearchAndChat.vue'
import DocumentList from './components/DocumentList.vue'
import AddDocument from './components/AddDocument.vue'
import StartScreen from './views/StartScreen.vue'

const routes = [
	{
		path: '/',
		name: 'init',
		component: StartScreen
	},
	{
		path: '/chat',
		name: 'search',
		component: SearchAndChat
	},
	{
		path: '/documents',
		name: 'documents',
		component: DocumentList
	},
	{
		path: '/add-document',
		name: 'add-document',
		component: AddDocument
	},
	{
		path: '/clear',
		name: 'clear',
		component: () => import('./views/ClearView.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
