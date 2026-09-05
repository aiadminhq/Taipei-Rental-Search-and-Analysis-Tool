import { defineConfig, devices } from '@playwright/test';

// Production is served from a sub-path (GitHub Pages: /<repo>/), so the smoke suite has to
// be runnable under the same prefix the build was made with. The webServer below builds in
// this same process, so `vite build` picks up VITE_BASE_PATH from the environment; every
// `page.goto()` in the specs is base-relative ('./…') and resolves against this baseURL.
const base = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  // Sandboxed/offline-CDP-emulation runs occasionally hit an environment-level stall
  // (e.g. a blocked third-party request racing the offline network emulation); one
  // CI retry absorbs that without masking a real, deterministic failure — kept off
  // locally so flakiness stays visible instead of being silently retried away.
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL: `http://localhost:4173${base}`,
    ...devices['Pixel 7'],
    // No-op unless PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH is set — lets a sandbox with a
    // pre-cached Chromium build that doesn't match this package's expected revision
    // (where `playwright install` is unavailable) still run locally.
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
