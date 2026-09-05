import { describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_PROFILE, parseInput, toListing } from '@trsat/core';
import { db, getProfile, saveProfile, upsertListing, setStatus, patchListing, addInbox, exportAll, importAll, clearAll, toggleCompare, getCompareIds } from '../src/db';

const now = '2026-09-05T00:00:00.000Z';
const mk = (text: string) => toListing(parseInput({ text }), now, 'shortlist');

beforeEach(async () => { await clearAll(); });

describe('profile', () => {
  it('returns DEFAULT_PROFILE when empty and persists changes', async () => {
    expect(await getProfile()).toEqual(DEFAULT_PROFILE);
    await saveProfile({ ...DEFAULT_PROFILE, mrtWalkMaxMin: 10 });
    expect((await getProfile()).mrtWalkMaxMin).toBe(10);
  });
});

describe('listings', () => {
  it('upsert computes rule and dedupe group', async () => {
    const a = await upsertListing(mk('大安區套房 14000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行5分 0912345678'));
    expect(a.rule?.tier).toBe('pass');
    const b = await upsertListing(mk('信義區雅房 9000 0912-345-678'));
    expect((await db.listings.get(b.id))?.dedupeGroupId).toBe((await db.listings.get(a.id))?.dedupeGroupId);
  });
  it('saveProfile recomputes rules', async () => {
    const a = await upsertListing(mk('大安區套房 14000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行5分'));
    await saveProfile({ ...DEFAULT_PROFILE, budget: { 套房: 10000, 雅房: 8000 } });
    expect((await db.listings.get(a.id))?.rule?.tier).toBe('fail');
  });
  it('setStatus appends history; patchListing bumps updatedAt', async () => {
    const a = await upsertListing(mk('大安區套房 14000'));
    await setStatus(a.id, 'contacted', '2026-09-06T00:00:00.000Z');
    const got = await db.listings.get(a.id);
    expect(got?.status).toBe('contacted');
    expect(got?.statusHistory.at(-1)).toEqual({ status: 'contacted', at: '2026-09-06T00:00:00.000Z' });
    await patchListing(a.id, { rent: 13000 });
    const p = await db.listings.get(a.id);
    expect(p?.rent).toBe(13000); expect(p!.updatedAt > now).toBe(true);
  });
});

describe('inbox / compare', () => {
  it('addInbox generates id and receivedAt', async () => {
    const i = await addInbox({ text: 'hello' });
    expect(i.id).toBeTruthy(); expect(i.receivedAt).toBeTruthy();
    expect(await db.inbox.count()).toBe(1);
  });
  it('toggleCompare caps at 3', async () => {
    for (const id of ['a', 'b', 'c']) await toggleCompare(id);
    expect(await toggleCompare('d')).toEqual(['a', 'b', 'c']);
    expect(await toggleCompare('a')).toEqual(['b', 'c']);
    expect(await getCompareIds()).toEqual(['b', 'c']);
  });
});

describe('export / import', () => {
  it('round-trips and merges by updatedAt', async () => {
    const a = await upsertListing(mk('大安區套房 14000'));
    const file = await exportAll();
    expect(file.version).toBe(1); expect(file.listings).toHaveLength(1);
    await clearAll();
    const older = { ...file, listings: [{ ...a, rent: 9999, updatedAt: '2020-01-01T00:00:00.000Z' }] };
    await importAll(file);
    const r = await importAll(older);
    expect(r.skipped).toBe(1);
    expect((await db.listings.get(a.id))?.rent).toBe(14000);
    const bad = await importAll({ version: 1, listings: [{ id: 'x' }] });
    expect(bad.errors.length).toBeGreaterThan(0);
  });
});
