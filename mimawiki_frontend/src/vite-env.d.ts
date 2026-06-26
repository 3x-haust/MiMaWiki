/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MIRIM_OAUTH_CLIENT_ID?: string;
  readonly VITE_MIRIM_OAUTH_CLIENT_SECRET?: string;
  readonly VITE_MIRIM_OAUTH_REDIRECT_URI?: string;
  readonly VITE_MIRIM_OAUTH_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
