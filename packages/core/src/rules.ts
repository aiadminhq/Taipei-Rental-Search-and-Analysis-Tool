import type { Listing, Profile, RuleReason, RuleResult, Tier } from './schema';
import { CITY_OF_DISTRICT, NEGATION_LOOKBEHIND, escapeRegExp } from './dictionaries';

export const TIER_LABEL: Record<Tier, string> = { pass: '符合', unknown: '待確認', fail: '不符' };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function budgetFor(l: Listing, p: Profile): number | undefined {
  switch (l.roomType) {
    case '套房': return p.budget.套房;
    case '雅房': return p.budget.雅房;
    case '整層': return p.budget.整層;
    case '分租': return p.budget.分租 ?? p.budget.套房;
    default: return undefined;
  }
}

export function evaluate(l: Listing, p: Profile, now: string = new Date().toISOString()): RuleResult {
  const reasons: RuleReason[] = [];
  const hay = `${l.title}\n${l.rawText ?? ''}\n${l.equipment.join(' ')}`;
  const fail = (code: string, message: string) => reasons.push({ kind: 'fail', code, message });
  const unknown = (code: string, message: string) => reasons.push({ kind: 'unknown', code, message });
  const pass = (code: string, message: string) => reasons.push({ kind: 'pass', code, message });
  // A plain `hay.includes(kw)` is negation-blind: 「無洗衣機」contains 洗衣機 (would count as
  // present), 「無壁癌」contains 壁癌 (would fail as a deal-breaker) and 「無陽台」contains 陽台
  // (would score a bonus). Reuse the same negation lookbehind the extractor uses so a keyword
  // only counts when it is not immediately preceded by 無／沒有／沒／不含／不提供／非.
  const mentions = (kw: string) => new RegExp(`${NEGATION_LOOKBEHIND}${escapeRegExp(kw)}`).test(hay);

  // 1) budget
  const budget = budgetFor(l, p);
  if (l.rent === undefined) unknown('missing_rent', '缺租金');
  else if (budget === undefined) {
    const maxBudget = Math.max(p.budget.套房, p.budget.雅房, p.budget.整層 ?? 0, p.budget.分租 ?? 0);
    if (l.rent > maxBudget + p.budgetTolerance) fail('over_budget', `租金 ${l.rent} 超出任何房型預算`);
    else unknown('missing_room_type', '房型不明，無法判定預算');
  } else if (l.rent > budget + p.budgetTolerance) fail('over_budget', `租金 ${l.rent} 超出 ${l.roomType} 預算 ${budget}`);
  else pass('within_budget', `租金 ${l.rent} 在預算內`);

  // 2) pets
  if (p.pets.required) {
    if (l.petPolicy === 'not_allowed') fail('pet_not_allowed', '不可養寵物');
    else if (l.petPolicy === 'allowed') pass('pet_allowed', '可養寵物');
    else if (l.petPolicy === 'negotiable') unknown('pet_negotiable', '寵物可議，需確認');
    else unknown('pet_unknown', '未提及寵物政策');
  }

  // 3) deal breakers
  for (const kw of p.dealBreakerKeywords) {
    if (kw && mentions(kw)) fail(`deal_breaker:${kw}`, `含「${kw}」`);
  }

  // 4) city
  const city = l.city ?? (l.district ? CITY_OF_DISTRICT[l.district] : undefined);
  if (!l.district && !city) unknown('missing_district', '缺地區');
  else if (city && !p.cities.includes(city)) fail('outside_cities', `地點 ${city} 不在範圍`);
  else pass('in_cities', `${city ?? ''}${l.district ?? ''}`.trim());

  // 5) MRT
  if (l.mrtWalkMin === undefined) unknown('mrt_unknown', '未提及捷運步行時間');
  else if (l.mrtWalkMin > p.mrtWalkMaxMin) fail('mrt_too_far', `捷運步行 ${l.mrtWalkMin} 分`);
  else pass('mrt_ok', `捷運步行 ${l.mrtWalkMin} 分`);

  // 6) must-have equipment
  let present = 0;
  for (const item of p.mustHave) {
    if (l.equipment.includes(item) || mentions(item)) { present++; pass(`has:${item}`, item); }
    else unknown(`missing_equipment:${item}`, `未提及${item}`);
  }

  // 7) move-in
  if (p.moveInBefore && l.availableFrom && l.availableFrom > p.moveInBefore) fail('available_too_late', `最早 ${l.availableFrom} 才可入住`);

  // 8) bonus
  let bonus = 0;
  for (const kw of p.bonusKeywords) {
    if (kw && mentions(kw)) { bonus++; reasons.push({ kind: 'bonus', code: `bonus:${kw}`, message: kw }); }
  }

  const tier: Tier = reasons.some((r) => r.kind === 'fail') ? 'fail' : reasons.some((r) => r.kind === 'unknown') ? 'unknown' : 'pass';

  // soft score
  const budgetScore = l.rent !== undefined && budget ? clamp((budget - l.rent) / budget, 0, 0.5) / 0.5 * 30 : 0;
  const equipScore = p.mustHave.length ? (present / p.mustHave.length) * 30 : 30;
  const mrtScore = l.mrtWalkMin !== undefined ? clamp(1 - l.mrtWalkMin / p.mrtWalkMaxMin, 0, 1) * 20 : 8;
  const bonusScore = Math.min(bonus, 2) / 2 * 10;
  const completeness = [l.rent, l.areaPing, l.district, l.mrtWalkMin, l.photos.length > 0 ? 1 : undefined, l.contactRaw].filter((v) => v !== undefined).length / 6 * 10;
  const softScore = Math.round(clamp(budgetScore + equipScore + mrtScore + bonusScore + completeness, 0, 100));

  return { tier, reasons, softScore, evaluatedAt: now };
}
