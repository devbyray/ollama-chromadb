import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				rewrite: path => path.replace(/^\/api/, '')
			}
		}
	},
	build: {
		lib: {
			entry: './lib/main.js',
			name: 'Counter',
			fileName: 'counter'
		}
	}
})
