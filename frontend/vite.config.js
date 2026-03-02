import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
// Configuramos outDir para que la build de Vite coloque los archivos
// en ../dist (directorio raíz "dist") para que Vercel los encuentre fácilmente.
// Esto evita mover los archivos después de la build.
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '../dist'
  }
})
