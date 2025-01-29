import { createRoot } from 'react-dom/client'
import App from './app/index'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
