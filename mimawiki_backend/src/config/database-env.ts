export type DatabaseConnectionSettings = {
  readonly host: string | undefined;
  readonly port: number | undefined;
  readonly username: string | undefined;
  readonly password: string | undefined;
  readonly database: string | undefined;
};

const parsePort = (value: string | undefined): number | undefined => {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }

  const parsedPort = Number(value);
  return Number.isFinite(parsedPort) ? parsedPort : undefined;
};

export const readDatabaseConnectionSettings = (
  env: NodeJS.ProcessEnv,
): DatabaseConnectionSettings => ({
  host: env.DB_HOST ?? env.DATABASE_HOST,
  port: parsePort(env.DB_PORT ?? env.DATABASE_PORT),
  username: env.DB_USERNAME ?? env.DB_USER ?? env.DATABASE_USER,
  password: env.DB_PASSWORD ?? env.DATABASE_PASSWORD,
  database: env.DB_DATABASE ?? env.DB_NAME ?? env.DATABASE_NAME,
});
