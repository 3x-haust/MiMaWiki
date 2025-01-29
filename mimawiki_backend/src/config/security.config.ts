export const SecurityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },
  cors: {
    allowedOrigins: process.env.CORS_ORIGINS?.split(',') || [],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  rateLimiting: {
    ttl: 60,
    limit: 100,
  },
  cookies: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  },
};
