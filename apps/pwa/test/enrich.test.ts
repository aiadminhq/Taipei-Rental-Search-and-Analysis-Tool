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
});
