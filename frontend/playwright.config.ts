import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  outputDir: 'test-results/playwright',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev -- --host 127.0.0.1',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev',
      cwd: '../server',
      url: 'http://127.0.0.1:3000/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        HOST: '127.0.0.1',
        PORT: '3000',
        CORS_ORIGINS: 'http://127.0.0.1:5173',
        ENABLE_TEST_RESET: 'true',
      },
    },
  ],
});
