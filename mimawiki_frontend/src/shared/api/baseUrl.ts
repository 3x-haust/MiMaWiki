const trimTrailingSlash = (url: string) => url.replace(/\/+$/, '');

export const MIMAWIKI_API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_MIMAWIKI_API_URL ?? 'https://api-mimawiki.mmhs.app',
);
