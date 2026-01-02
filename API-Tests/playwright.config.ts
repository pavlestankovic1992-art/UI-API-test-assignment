import { defineConfig } from '@playwright/test';
import { randomUUID } from 'crypto';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 2,
  use: {
    baseURL: 'https://wallet-api.solflare.com',
    extraHTTPHeaders: {
      Authorization: `Bearer ${randomUUID()}`,
      'Content-Type': 'application/json',
    },
  },
  reporter: [['list']],
});
