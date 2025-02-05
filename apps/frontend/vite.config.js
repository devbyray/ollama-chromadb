import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import 'dotenv/config'

const serverPort = process.env.SERVER_PORT || 3000
const serverHost = process.env.SERVER_HOST || 'localhost'

export default defineConfig({
	plugins: [vue(), tailwindcss()],
	server: {
		proxy: {
			'/api': {
				target: `http://${serverHost}:${serverPort}`,
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			}
		}
	}
})
