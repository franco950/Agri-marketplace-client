import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom'


const queryClient = new QueryClient();



createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <BrowserRouter basename="/Agri-marketplace-client">
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
