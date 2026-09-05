import { describe, it, expect } from 'vitest';
import { extractFields } from '../src/extract';
import { POSTS } from './fixtures/posts';

describe('extractFields', () => {
  for (const f of POSTS) {
    it(f.name, () => {
      const got = extractFields(f.text);
      for (const [k, v] of Object.entries(f.expect)) {
        expect(got[k as keyof typeof got], k).toEqual(v);
      }
    });
  }

  it('does not treat a phone number or area as rent', () => {
    const got = extractFields('套房 洽 0912345678 約 10坪');
    expect(got.rent).toBeUndefined();
    expect(got.areaPing).toBe(10);
  });

  it('ignores negated equipment', () => {
    expect(extractFields('無對外窗 沒有洗衣機').equipment).toEqual([]);
  });

  it('defaults roomType 未知 and petPolicy unknown', () => {
    const got = extractFields('台北市大安區 房子出租');
    expect(got.roomType).toBe('未知');
    expect(got.petPolicy).toBe('unknown');
  });
});
