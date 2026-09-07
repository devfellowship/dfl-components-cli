import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  // The performance gate needs an idle browser, including on shared CI hosts.
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:6107',
    viewport: { width: 1280, height: 900 },
    channel: process.env.PW_CHANNEL || undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npx storybook dev -p 6107 --ci --no-open',
    url: 'http://127.0.0.1:6107/index.json',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
