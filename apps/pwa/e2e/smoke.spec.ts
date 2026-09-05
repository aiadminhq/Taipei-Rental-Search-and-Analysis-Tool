import { test, expect } from '@playwright/test';

const post = '大安區獨立套房\n租金 14,500/月\n變頻冷氣 冰箱 洗衣機 對外窗\n可養貓 捷運科技大樓站 步行6分';

test.beforeEach(async ({ page }) => {
  // Block third-party CDNs (Google Fonts, Google Maps) so the run is hermetic and
  // deterministic in environments without outbound access to those hosts.
  await page.route(/^https:\/\/(fonts\.(googleapis|gstatic)\.com|.*\.google\.com)\//, (route) => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => indexedDB.deleteDatabase('trsat'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // complete onboarding
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByRole('button', { name: '下一步' }).click();
  await page.getByRole('button', { name: '開始使用' }).click();
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
  await page.evaluate(() => indexedDB.deleteDatabase('trsat'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '下一步' }).click(); await page.getByRole('button', { name: '下一步' }).click(); await page.getByRole('button', { name: '開始使用' }).click();
  await page.goto('/#/settings', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type=file]').setInputFiles(path!);
  await page.goto('/#/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('NT$14,500')).toBeVisible();
});
