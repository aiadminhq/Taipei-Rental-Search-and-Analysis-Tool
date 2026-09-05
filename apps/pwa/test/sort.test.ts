import { describe, it, expect } from 'vitest';
import { parseInput, toListing, evaluate, DEFAULT_PROFILE, type Listing } from '@trsat/core';
import { sortListings, applyFilters, groupByDedupe } from '../src/lib/sort';

const now = '2026-09-05T00:00:00.000Z';
const L = (text: string, over: Partial<Listing> = {}): Listing => {
  const l = { ...toListing(parseInput({ text }), now), ...over };
  return { ...l, rule: evaluate(l, DEFAULT_PROFILE, now) };
};

describe('sortListings', () => {
  it('orders pass < unknown < fail, then softScore desc, rent asc', () => {
    const fail = L('大安區套房 25000', { id: 'fail' });
    const unk = L('大安區套房 14000', { id: 'unk' });
    const passHi = L('大安區套房 12000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行3分', { id: 'passHi' });
    const passLo = L('大安區套房 14900 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行14分', { id: 'passLo' });
    expect(sortListings([fail, unk, passLo, passHi]).map((l) => l.id)).toEqual(['passHi', 'passLo', 'unk', 'fail']);
  });
});
describe('applyFilters', () => {
  it('filters by tier/status/district/pending', () => {
    const a = L('大安區套房 14000', { id: 'a', status: 'shortlist' });
    const b = L('信義區套房 14000', { id: 'b', status: 'viewed', enrichment: 'pending' });
    expect(applyFilters([a, b], { district: '信義區' }).map((l) => l.id)).toEqual(['b']);
    expect(applyFilters([a, b], { status: 'shortlist' }).map((l) => l.id)).toEqual(['a']);
    expect(applyFilters([a, b], { pendingOnly: true }).map((l) => l.id)).toEqual(['b']);
    expect(applyFilters([a, b], { tier: 'unknown' })).toHaveLength(2);
  });
});
describe('groupByDedupe', () => {
  it('folds same group, keeps first as representative', () => {
    const a = L('x 12000', { id: 'a', dedupeGroupId: 'g1' });
    const b = L('y 12000', { id: 'b', dedupeGroupId: 'g1' });
    const c = L('z 12000', { id: 'c' });
    const g = groupByDedupe([a, b, c]);
    expect(g).toHaveLength(2);
    expect(g[0].rep.id).toBe('a'); expect(g[0].others.map((x) => x.id)).toEqual(['b']);
  });
});
