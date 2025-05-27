import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig(({ command }) => {
  
  if (command =='serve') {
    
    return {
      plugins: [react()],
      
    }
  } else {
    
    return {
      plugins: [react()],
      base: "/Agri-marketplace-client/"
    }
  }
})