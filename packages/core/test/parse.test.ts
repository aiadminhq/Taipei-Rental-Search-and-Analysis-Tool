import { describe, it, expect } from 'vitest';
import { parseInput, toListing } from '../src/parse';
import { ListingSchema } from '../src/schema';
import { POSTS } from './fixtures/posts';

const now = '2026-09-05T00:00:00.000Z';

describe('parseInput', () => {
  it('uses url when given, and extracts url from text when not', () => {
    const a = parseInput({ url: 'https://rent.591.com.tw/18234567', title: '大安套房' });
    expect(a.source).toBe('591'); expect(a.sourceId).toBe('18234567'); expect(a.title).toBe('大安套房');
    const b = parseInput({ text: '看這個 https://www.threads.com/@x/post/ABC123 大安區套房 14000' });
    expect(b.source).toBe('threads'); expect(b.sourceId).toBe('ABC123'); expect(b.fields.rent).toBe(14000);
  });
  it('detects ptt from text signature, else manual with hash id', () => {
    const p = parseInput({ text: '作者 abc (小明) 看板 Rent_apart 標題 [無/台北/大安] 套房 租金：15000' });
    expect(p.source).toBe('ptt');
    const m = parseInput({ text: POSTS[0].text });
    expect(m.source).toBe('manual'); expect(m.sourceId).toMatch(/^[0-9a-f]{8}$/);
    expect(parseInput({ text: POSTS[0].text }).sourceId).toBe(m.sourceId);
  });
  it('title falls back to first line, then url, then default', () => {
    expect(parseInput({ text: '第一行標題\n第二行' }).title).toBe('第一行標題');
    expect(parseInput({ url: 'https://rent.591.com.tw/1' }).title).toBe('https://rent.591.com.tw/1');
    expect(parseInput({}).title).toBe('未命名房源');
  });
  it('computes confidence and missing', () => {
    const full = parseInput({ text: POSTS[0].text });
    expect(full.extraction.missing).toEqual([]);
    expect(full.extraction.confidence).toBeGreaterThan(0.8);
    const bare = parseInput({ url: 'https://rent.591.com.tw/1' });
    expect(bare.extraction.method).toBe('url');
    expect(bare.extraction.missing).toEqual(['rent', 'roomType', 'district']);
    expect(bare.extraction.confidence).toBeLessThan(0.4);
  });
});

describe('toListing', () => {
  it('produces a schema-valid listing with id source:sourceId', () => {
    const l = toListing(parseInput({ text: POSTS[0].text }), now, 'shortlist');
    expect(() => ListingSchema.parse(l)).not.toThrow();
    expect(l.id).toBe(`manual:${l.sourceId}`);
    expect(l.status).toBe('shortlist');
    expect(l.statusHistory).toEqual([{ status: 'shortlist', at: now }]);
    expect(l.rent).toBe(14500); expect(l.phoneNormalized).toBe('0912345678'); expect(l.contactRaw).toBe('0912345678');
    expect(l.enrichment).toBe('none');
  });
});
