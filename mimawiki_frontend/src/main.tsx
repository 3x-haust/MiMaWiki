import { createRoot } from 'react-dom/client'
import App from './app/index'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import GlobalStyles from './app/styles/GlobalStyle'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalStyles />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
