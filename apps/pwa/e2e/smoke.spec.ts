import { test, expect, type Page } from '@playwright/test';

const post = '大安區獨立套房\n租金 14,500/月\n變頻冷氣 冰箱 洗衣機 對外窗\n可養貓 捷運科技大樓站 步行6分';

// Collected per-test, printed only on failure by afterEach below — kept as a plain
// module-level array since this file always runs with a single worker (sequential).
let diag: string[] = [];

function attachDiagnostics(page: Page): void {
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') diag.push(`console:${m.type()}:${m.text()}`);
  });
  page.on('pageerror', (e) => diag.push(`pageerror:${e.toString()}`));
  page.on('requestfailed', (r) => diag.push(`requestfailed:${r.url()}:${r.failure()?.errorText ?? ''}`));
}

async function resetAndOnboard(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // Unregister any service worker first — a stale precached index.html surviving
  // across tests would otherwise mask a real app change, and can also hold an
  // IndexedDB connection open.
  await page.evaluate(async () => {
    const regs = (await navigator.serviceWorker?.getRegistrations?.()) ?? [];
    await Promise.all(regs.map((r) => r.unregister()));
  });
  // `indexedDB.deleteDatabase(...)` returns an IDBOpenDBRequest, not a Promise —
  // awaiting it directly (as a bare expression) does not actually wait for the
  // delete to finish. Wrap it so the delete is guaranteed to have settled
  // (success, error, or blocked-then-resolved) before the next reload opens a
  // fresh connection; skipping this can otherwise leave the delete permanently
  // blocked if the new connection opens before the old one's close is processed.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const r = indexedDB.deleteDatabase('trsat');
        r.onsuccess = () => resolve();
        r.onerror = () => resolve();
        r.onblocked = () => resolve();
      }),
  );
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByRole('button', { name: '開始使用' }).click();
  // The last step's onClick is `await setOnboarded(); onDone();` — an async IndexedDB
  // write followed by the React state flip that leaves the onboarding screen. A bare
  // `.click()` only waits for the click to dispatch, not for that handler to finish;
  // proceeding straight to a hard navigation can tear the document down mid-write,
  // losing the "onboarded" flag and reintroducing the gate on the next load. Waiting
  // for the app's real content to appear guarantees the write has landed, since the
  // state flip happens strictly after the awaited write in the same handler.
  await expect(page.getByRole('heading', { name: '房源' })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  diag = [];
  attachDiagnostics(page);
  // Block third-party CDNs (Google Fonts, Google Maps) so the run is hermetic and
  // deterministic in environments without outbound access to those hosts.
  await page.route(/^https:\/\/(fonts\.(googleapis|gstatic)\.com|.*\.google\.com)\//, (route) => route.abort());
  await resetAndOnboard(page);
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log('[diag] url', page.url());
    console.log('[diag] errors', JSON.stringify(diag).slice(0, 4000));
    console.log('[diag] aria', (await page.locator('body').ariaSnapshot().catch((e) => String(e))).slice(0, 4000));
    console.log(
      '[diag] sw',
      await page.evaluate(() => navigator.serviceWorker?.controller?.state ?? 'none').catch((e) => String(e)),
    );
    console.log(
      '[diag] idb',
      await page
        .evaluate(async () => ((await indexedDB.databases?.()) ?? []).map((d) => `${d.name}:${d.version}`))
        .catch((e) => String(e)),
    );
  }
});

test('share_target query → preview → 加入 → listed', async ({ page }) => {
  await page.goto(`/?text=${encodeURIComponent(post)}`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('NT$14,500')).toBeVisible();
  await expect(page.getByText('符合').first()).toBeVisible();
  await page.getByRole('button', { name: '加入房源' }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByText('NT$14,500')).toBeVisible();
});

test('works offline after first load', async ({ page, context }) => {
  // Navigating while `context.setOffline(true)` still has to resolve the page's
  // external Google Fonts <link> (aborted via the route above); in a sandboxed/
  // proxied network this abort can take several seconds to settle instead of
  // failing instantly, so give this test extra wall-clock headroom.
  test.setTimeout(60_000);
  await page.goto(`/?text=${encodeURIComponent(post)}`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '加入房源' }).click();
  await expect(page).toHaveURL(/#\/$/);
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText('NT$14,500')).toBeVisible();
  await page.goto(`/?text=${encodeURIComponent('中和雅房 8000')}`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('NT$8,000')).toBeVisible();
  await context.setOffline(false);
});

test('export then import restores data', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto(`/?text=${encodeURIComponent(post)}`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '加入房源' }).click();
  // Wait for the add() handler's own SPA navigation (history.replaceState) to land
  // before doing a hard `goto` — otherwise the goto can race the in-flight write/
  // navigate and tear down the document before it settles.
  await expect(page).toHaveURL(/#\/$/);
  await page.goto('/#/settings', { waitUntil: 'domcontentloaded' });
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: '匯出 JSON' }).click()]);
  const path = await download.path();
  await resetAndOnboard(page);
  await page.goto('/#/settings', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type=file]').setInputFiles(path!);
  await page.goto('/#/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('NT$14,500')).toBeVisible();
});
