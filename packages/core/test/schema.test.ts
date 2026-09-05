import { describe, it, expect } from 'vitest';
import { ListingSchema, ProfileSchema, DEFAULT_PROFILE, ExportFileSchema } from '../src/schema';

const now = '2026-09-05T00:00:00.000Z';
export const minimalListing = {
  id: '591:12345678', source: '591', sourceId: '12345678', url: 'https://rent.591.com.tw/12345678',
  title: '大安區精緻套房', roomType: '套房', equipment: [], photos: [],
  fetchedAt: now, updatedAt: now,
  extraction: { method: 'url', confidence: 0.3, missing: ['rent', 'district'] },
  enrichment: 'none', status: 'inbox', statusHistory: [{ status: 'inbox', at: now }],
  pinned: false, extra: {},
};

describe('ListingSchema', () => {
  it('accepts a minimal listing', () => {
    expect(ListingSchema.parse(minimalListing).id).toBe('591:12345678');
  });
  it('rejects unknown source and negative rent', () => {
    expect(() => ListingSchema.parse({ ...minimalListing, source: 'craigslist' })).toThrow();
    expect(() => ListingSchema.parse({ ...minimalListing, rent: -1 })).toThrow();
  });
});

describe('ProfileSchema', () => {
  it('DEFAULT_PROFILE matches the personal requirements in the spec', () => {
    const p = ProfileSchema.parse(DEFAULT_PROFILE);
    expect(p.budget.套房).toBe(15000);
    expect(p.budget.雅房).toBe(10000);
    expect(p.cities).toEqual(['台北市', '新北市']);
    expect(p.mrtWalkMaxMin).toBe(15);
    expect(p.mustHave).toEqual(['變頻冷氣', '冰箱', '對外窗', '洗衣機']);
    expect(p.pets.required).toBe(true);
    expect(p.dealBreakerKeywords).toContain('壁癌');
  });
});

describe('ExportFileSchema', () => {
  it('round-trips', () => {
    const file = { version: 1, exportedAt: now, profile: DEFAULT_PROFILE, listings: [minimalListing], inbox: [] };
    expect(ExportFileSchema.parse(file).listings).toHaveLength(1);
  });
});
