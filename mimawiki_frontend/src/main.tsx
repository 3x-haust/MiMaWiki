import { createRoot } from 'react-dom/client'
import { MirimOAuthProvider } from 'mirim-oauth-react'
import App from './app/index'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import GlobalStyles from './app/styles/GlobalStyle'
import { getMirimOAuthConfig, MIRIM_OAUTH_SCOPES } from './features/auth/mirimOAuthConfig'

const rootElement = document.getElementById('root')
if (rootElement === null) {
  throw new Error('Root element is missing')
}

const oauthConfig = getMirimOAuthConfig()

createRoot(rootElement).render(
  <StrictMode>
    <MirimOAuthProvider
      clientId={oauthConfig.clientId}
      clientSecret={oauthConfig.clientSecret}
      redirectUri={oauthConfig.redirectUri}
      scopes={MIRIM_OAUTH_SCOPES}
      oauthServerUrl={oauthConfig.oauthServerUrl}
    >
      <BrowserRouter>
        <GlobalStyles />
        <App />
      </BrowserRouter>
    </MirimOAuthProvider>
  </StrictMode>,
)
