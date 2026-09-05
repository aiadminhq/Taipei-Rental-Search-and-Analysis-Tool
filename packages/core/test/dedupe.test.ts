import { describe, it, expect } from 'vitest';
import { normalizePhone, hammingHex, isLikelyDuplicate, assignDedupeGroups } from '../src/dedupe';
import { parseInput, toListing } from '../src/parse';
import type { Listing } from '../src/schema';

const now = '2026-09-05T00:00:00.000Z';
const L = (text: string, over: Partial<Listing> = {}): Listing => ({ ...toListing(parseInput({ text }), now), ...over });

describe('normalizePhone', () => {
  it.each([
    ['0912-345-678', '0912345678'], ['+886 912 345 678', '0912345678'], ['886912345678', '0912345678'],
    ['02-2345-6789', '0223456789'], ['私訊', undefined], [undefined, undefined],
  ])('%s → %s', (raw, want) => { expect(normalizePhone(raw)).toBe(want); });
});

describe('hammingHex', () => {
  it('counts differing bits', () => {
    expect(hammingHex('ff00', 'ff00')).toBe(0);
    expect(hammingHex('ff00', 'ff01')).toBe(1);
    expect(hammingHex('0000', 'ffff')).toBe(16);
  });
});

describe('isLikelyDuplicate', () => {
  it('same phone → phone', () => {
    expect(isLikelyDuplicate(L('a 套房 12000 0912345678', { id: 'a' }), L('b 雅房 8000 0912-345-678', { id: 'b' }))).toBe('phone');
  });
  it('near photo hash → photo', () => {
    const a = L('大安區套房 12000', { id: 'a', photoHashes: ['ff00ff00ff00ff00'] });
    const b = L('大安區套房 12500', { id: 'b', photoHashes: ['ff00ff00ff00ff03'] });
    expect(isLikelyDuplicate(a, b)).toBe('photo');
  });
  it('same district, rent within 500, area within 1 → fuzzy', () => {
    expect(isLikelyDuplicate(L('大安區套房 12000 8坪', { id: 'a' }), L('大安區套房 12400 8.5坪', { id: 'b' }))).toBe('fuzzy');
    expect(isLikelyDuplicate(L('大安區套房 12000 8坪', { id: 'a' }), L('信義區套房 12000 8坪', { id: 'b' }))).toBeNull();
  });
});

describe('assignDedupeGroups', () => {
  it('unions by phone/photo and uses smallest id as group id', () => {
    const a = L('x 套房 12000 0912345678', { id: '591:2' });
    const b = L('y 套房 13000 0912345678', { id: 'threads:1' });
    const c = L('z 套房 9000', { id: 'ptt:3' });
    const g = assignDedupeGroups([a, b, c]);
    expect(g.get('591:2')).toBe('591:2'); expect(g.get('threads:1')).toBe('591:2'); expect(g.get('ptt:3')).toBe('ptt:3');
  });
});
