import { describe, it, expect } from 'vitest';
import { extractFirstUrl, parseSourceUrl, hashId } from '../src/source';

describe('extractFirstUrl', () => {
  it('finds the first http(s) url and strips trailing punctuation', () => {
    expect(extractFirstUrl('看這間 https://rent.591.com.tw/18234567, 不錯')).toBe('https://rent.591.com.tw/18234567');
    expect(extractFirstUrl('沒有連結')).toBeNull();
  });
});

describe('parseSourceUrl', () => {
  it.each([
    ['https://rent.591.com.tw/18234567', '591', '18234567', 'https://rent.591.com.tw/18234567'],
    ['https://m.591.com.tw/v2/rent/18234567?x=1', '591', '18234567', 'https://rent.591.com.tw/18234567'],
    ['https://www.threads.com/@rent_tpe/post/DNG2tXiBjzN?xmt=abc', 'threads', 'DNG2tXiBjzN', 'https://www.threads.com/@rent_tpe/post/DNG2tXiBjzN'],
    ['https://www.threads.net/@rent_tpe/post/DNG2tXiBjzN', 'threads', 'DNG2tXiBjzN', 'https://www.threads.com/@rent_tpe/post/DNG2tXiBjzN'],
    ['https://www.facebook.com/marketplace/item/123456789012345/?ref=x', 'fb_marketplace', '123456789012345', 'https://www.facebook.com/marketplace/item/123456789012345/'],
    ['https://www.facebook.com/groups/taipeirent/posts/987654321/', 'fb_group', 'taipeirent:987654321', 'https://www.facebook.com/groups/taipeirent/posts/987654321/'],
    ['https://m.facebook.com/groups/12345/permalink/67890/', 'fb_group', '12345:67890', 'https://www.facebook.com/groups/12345/posts/67890/'],
    ['https://www.ptt.cc/bbs/Rent_apart/M.1725000000.A.1B2.html', 'ptt', 'M.1725000000.A.1B2', 'https://www.ptt.cc/bbs/Rent_apart/M.1725000000.A.1B2.html'],
  ])('%s → %s/%s', (url, source, id, canonical) => {
    expect(parseSourceUrl(url)).toEqual({ source, sourceId: id, canonicalUrl: canonical });
  });

  it('falls back to other with a stable hash id', () => {
    const a = parseSourceUrl('https://rent.rakuya.com.tw/rent_item/1234');
    expect(a?.source).toBe('other');
    expect(a?.sourceId).toBe(hashId('https://rent.rakuya.com.tw/rent_item/1234'));
  });

  it('returns null for non-urls', () => {
    expect(parseSourceUrl('not a url')).toBeNull();
  });
});

describe('hashId', () => {
  it('is deterministic 8-hex', () => {
    expect(hashId('abc')).toMatch(/^[0-9a-f]{8}$/);
    expect(hashId('abc')).toBe(hashId('abc'));
    expect(hashId('abc')).not.toBe(hashId('abd'));
  });
});
