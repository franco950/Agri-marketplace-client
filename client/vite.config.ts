import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools'



export default defineConfig(({ command }) => ({
  plugins: [react(), imagetools()],
  base: command === 'build' ? '/Agri-marketplace-client/' : '/',
  build: {
    outDir: 'dist',
  },
}));
