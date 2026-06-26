import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: '.',
  timeout: 10_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
