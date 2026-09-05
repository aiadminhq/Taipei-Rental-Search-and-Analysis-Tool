import { describe, it, expect } from 'vitest';
import { evaluate, TIER_LABEL } from '../src/rules';
import { DEFAULT_PROFILE, type Listing } from '../src/schema';
import { parseInput, toListing } from '../src/parse';
import { POSTS } from './fixtures/posts';

const now = '2026-09-05T00:00:00.000Z';
const mk = (over: Partial<Listing>): Listing => ({
  ...toListing(parseInput({ text: '大安區套房 14000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行5分' }), now),
  ...over,
});
const codes = (l: Listing) => evaluate(l, DEFAULT_PROFILE, now).reasons.map((r) => r.code);

describe('evaluate – tiers', () => {
  it('full match → pass', () => {
    const r = evaluate(mk({}), DEFAULT_PROFILE, now);
    expect(r.tier).toBe('pass');
    expect(r.softScore).toBeGreaterThan(40);   // 4 (budget) + 30 (equipment) + 13 (mrt) + 5 (completeness)
  });
  it('over budget → fail (with tolerance)', () => {
    expect(evaluate(mk({ rent: 16000 }), DEFAULT_PROFILE, now).tier).toBe('pass');  // 15000 + 1000 tolerance
    expect(evaluate(mk({ rent: 16001 }), DEFAULT_PROFILE, now).tier).toBe('fail');
    expect(codes(mk({ rent: 20000 }))).toContain('over_budget');
  });
  it('雅房 uses 雅房 budget; 分租 falls back to 套房 budget', () => {
    expect(evaluate(mk({ roomType: '雅房', rent: 12000 }), DEFAULT_PROFILE, now).tier).toBe('fail');
    expect(evaluate(mk({ roomType: '分租', rent: 15000 }), DEFAULT_PROFILE, now).tier).toBe('pass');
  });
  it('pets not allowed → fail; unknown → unknown', () => {
    expect(codes(mk({ petPolicy: 'not_allowed' }))).toContain('pet_not_allowed');
    const r = evaluate(mk({ petPolicy: 'unknown' }), DEFAULT_PROFILE, now);
    expect(r.tier).toBe('unknown'); expect(r.reasons.map((x) => x.code)).toContain('pet_unknown');
  });
  it('deal-breaker keyword in text → fail', () => {
    expect(codes(mk({ rawText: '大安區套房 有點壁癌' }))).toContain('deal_breaker:壁癌');
  });
  it('outside cities → fail; no district → unknown', () => {
    expect(codes(mk({ city: '桃園市', district: '中壢區' }))).toContain('outside_cities');
    expect(evaluate(mk({ city: undefined, district: undefined }), DEFAULT_PROFILE, now).tier).toBe('unknown');
  });
  it('mrt too far → fail; missing → unknown', () => {
    expect(codes(mk({ mrtWalkMin: 20 }))).toContain('mrt_too_far');
    expect(codes(mk({ mrtWalkMin: undefined }))).toContain('mrt_unknown');
  });
  it('missing must-have equipment → unknown, never fail', () => {
    const r = evaluate(mk({ title: '大安區套房', equipment: ['冷氣'], rawText: '大安區套房' }), DEFAULT_PROFILE, now);
    expect(r.tier).toBe('unknown');
    expect(r.reasons.map((x) => x.code)).toContain('missing_equipment:洗衣機');
  });
  it('missing rent → unknown; missing rent but roomType 未知 and no budget → unknown', () => {
    expect(codes(mk({ rent: undefined }))).toContain('missing_rent');
  });
  it('available after moveInBefore → fail', () => {
    const p = { ...DEFAULT_PROFILE, moveInBefore: '2026-10-01' };
    expect(evaluate(mk({ availableFrom: '2026-11-01' }), p, now).reasons.map((r) => r.code)).toContain('available_too_late');
  });
  it('bonus keywords add reasons and score', () => {
    const base = evaluate(mk({}), DEFAULT_PROFILE, now).softScore;
    const withBonus = evaluate(mk({ rawText: '大安區套房 有露台 電梯' }), DEFAULT_PROFILE, now);
    expect(withBonus.reasons.some((r) => r.kind === 'bonus')).toBe(true);
    expect(withBonus.softScore).toBeGreaterThan(base);
  });
  it('fixtures: threads full post passes, fb 禁寵 fails', () => {
    expect(evaluate(toListing(parseInput({ text: POSTS[0].text }), now), DEFAULT_PROFILE, now).tier).toBe('pass');
    expect(evaluate(toListing(parseInput({ text: POSTS[1].text }), now), DEFAULT_PROFILE, now).tier).toBe('fail');
  });
  it('labels', () => { expect(TIER_LABEL.pass).toBe('符合'); });
});
