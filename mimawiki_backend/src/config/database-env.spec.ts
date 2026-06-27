import { readDatabaseConnectionSettings } from './database-env';

describe('readDatabaseConnectionSettings', () => {
  it('uses deploy database aliases when Nest-specific names are absent', () => {
    const settings = readDatabaseConnectionSettings({
      DB_HOST: 'mimawiki-postgres',
      DB_PORT: '5432',
      DB_USER: 'postgres',
      DB_PASSWORD: 'secret',
      DB_NAME: 'mimawiki',
    });

    expect(settings).toEqual({
      host: 'mimawiki-postgres',
      port: 5432,
      username: 'postgres',
      password: 'secret',
      database: 'mimawiki',
    });
  });
});
