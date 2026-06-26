export const MIRIM_OAUTH_SCOPES = 'email,nickname,profileImageUrl';

export const getMirimOAuthConfig = () => ({
  clientId: import.meta.env.VITE_MIRIM_OAUTH_CLIENT_ID ?? '',
  clientSecret: import.meta.env.VITE_MIRIM_OAUTH_CLIENT_SECRET ?? '',
  redirectUri:
    import.meta.env.VITE_MIRIM_OAUTH_REDIRECT_URI ??
    `${window.location.origin}/callback`,
  oauthServerUrl:
    import.meta.env.VITE_MIRIM_OAUTH_SERVER_URL ?? 'https://api-auth.mmhs.app',
});

export const hasMirimOAuthConfig = () => {
  const config = getMirimOAuthConfig();
  return config.clientId.length > 0 && config.clientSecret.length > 0;
};
