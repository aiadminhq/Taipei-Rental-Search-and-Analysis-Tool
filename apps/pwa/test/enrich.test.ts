import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { parseInput, toListing } from '@trsat/core';
import { clearAll, db, upsertListing } from '../src/db';
import { enrich, setEndpoint, getEndpoint, testEndpoint } from '../src/lib/enrich';

const now = '2026-09-05T00:00:00.000Z';
beforeEach(async () => { await clearAll(); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('enrich', () => {
  it('marks pending when no endpoint configured', async () => {
    const l = await upsertListing(toListing(parseInput({ url: 'https://rent.591.com.tw/18234567' }), now));
    expect(await enrich(l.id)).toBe('pending');
    expect((await db.listings.get(l.id))?.enrichment).toBe('pending');
  });
  it('merges fields from endpoint and marks done', async () => {
    await setEndpoint('https://laptop.tail1234.ts.net');
    expect(await getEndpoint()).toBe('https://laptop.tail1234.ts.net');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: true, listing: { rent: 15500, district: '大安區', roomType: '套房', photos: ['https://img/1.jpg'] } }), { status: 200 })));
    const l = await upsertListing(toListing(parseInput({ url: 'https://rent.591.com.tw/18234567' }), now));
    expect(await enrich(l.id)).toBe('done');
    const got = await db.listings.get(l.id);
    expect(got?.rent).toBe(15500); expect(got?.enrichment).toBe('done'); expect(got?.extraction.method).toBe('cli_fetch'); expect(got?.rule?.tier).toBeDefined();
  });
  it('401 SESSION_EXPIRED → failed', async () => {
    await setEndpoint('https://x');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ ok: false, code: 'SESSION_EXPIRED', message: 'FB login expired' }), { status: 401 })));
    const l = await upsertListing(toListing(parseInput({ url: 'https://www.facebook.com/groups/g/posts/1/' }), now));
    expect(await enrich(l.id)).toBe('failed');
    expect((await db.listings.get(l.id))?.enrichment).toBe('failed');
  });
  it('testEndpoint true on 200', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('ok', { status: 200 })));
    expect(await testEndpoint('https://x')).toBe(true);
  });
  it('unreachable endpoint → silent pending, never failed (spec §10)', async () => {
    await setEndpoint('https://laptop.tail1234.ts.net');
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch'); }));
    const l = await upsertListing(toListing(parseInput({ url: 'https://rent.591.com.tw/18234567' }), now));
    expect(await enrich(l.id)).toBe('pending');
    expect((await db.listings.get(l.id))?.enrichment).toBe('pending');
  });
  it('non-2xx from a reachable endpoint still → failed', async () => {
    await setEndpoint('https://x');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 500 })));
    const l = await upsertListing(toListing(parseInput({ url: 'https://rent.591.com.tw/18234567' }), now));
    expect(await enrich(l.id)).toBe('failed');
    expect((await db.listings.get(l.id))?.enrichment).toBe('failed');
  });
  it('sends no ambient credentials (spec §8)', async () => {
    await setEndpoint('https://x');
    const f = vi.fn(async (_input: string, _init?: RequestInit) => new Response(JSON.stringify({ ok: true, listing: { rent: 15500 } }), { status: 200 }));
    vi.stubGlobal('fetch', f);
    const l = await upsertListing(toListing(parseInput({ url: 'https://rent.591.com.tw/18234567' }), now));
    await enrich(l.id);
    await testEndpoint('https://x');
    expect(f.mock.calls).toHaveLength(2);
    for (const [, init] of f.mock.calls) expect(init).toMatchObject({ credentials: 'omit', mode: 'cors' });
  });
});

describe('setEndpoint', () => {
  it('rejects non-https URLs', async () => {
    await expect(setEndpoint('http://example.com')).rejects.toThrow('endpoint 必須是 https:// 網址');
    await expect(setEndpoint('ftp://example.com')).rejects.toThrow('endpoint 必須是 https:// 網址');
    await expect(setEndpoint('not a url')).rejects.toThrow('endpoint 必須是 https:// 網址');
    expect(await getEndpoint()).toBeUndefined();
  });
  it('allows plain http on localhost / 127.0.0.1 for dev, trimming trailing slashes', async () => {
    await setEndpoint('http://localhost:3000');
    expect(await getEndpoint()).toBe('http://localhost:3000');
    await setEndpoint('http://127.0.0.1:8787/');
    expect(await getEndpoint()).toBe('http://127.0.0.1:8787');
    await setEndpoint('https://laptop.tail1234.ts.net/');
    expect(await getEndpoint()).toBe('https://laptop.tail1234.ts.net');
  });
});
