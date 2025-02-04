import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	plugins: [vue(), tailwindcss()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				secure: false,
				ws: true,
				rewrite: path => path.replace(/^\/api/, ''),
				configure: (proxy, _options) => {
					proxy.on('error', (err, _req, _res) => {
						console.log('proxy error', err)
					})
					proxy.on('proxyReq', (proxyReq, req, _res) => {
						console.log('Sending Request to:', req.url)
					})
					proxy.on('proxyRes', (proxyRes, req, _res) => {
						console.log('Received Response from:', req.url, 'Status:', proxyRes.statusCode)
					})
				}
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
