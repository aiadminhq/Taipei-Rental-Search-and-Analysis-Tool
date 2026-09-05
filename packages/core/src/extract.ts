import type { PetPolicy, RoomType } from './schema';
import { ALL_DISTRICTS, CITY_OF_DISTRICT, CN_NUM, EQUIPMENT_ALIASES, NEGATION_LOOKBEHIND, PET_ALLOW, PET_DENY, PET_NEGOTIABLE } from './dictionaries';

export interface ExtractedFields {
  rent?: number;
  depositMonths?: number;
  managementFee?: number;
  areaPing?: number;
  layout?: string;
  roomType: RoomType;
  city?: string;
  district?: string;
  mrtNearest?: string;
  mrtWalkMin?: number;
  phone?: string;
  petPolicy: PetPolicy;
  equipment: string[];
  bonusHits: string[];
}

const toInt = (s: string) => parseInt(s.replace(/,/g, ''), 10);
const MIN_RENT = 3000, MAX_RENT = 200000;
const inRentRange = (n: number) => n >= MIN_RENT && n <= MAX_RENT;

export function extractRent(text: string): number | undefined {
  // 1) explicit label
  const labeled = text.match(/(?:租金|月租|房租|價格|價錢|售價)[：:\s]*(?:NT\$?|\$)?\s*(\d{1,3}(?:,\d{3})+|\d{4,6})/);
  if (labeled && inRentRange(toInt(labeled[1]))) return toInt(labeled[1]);
  // 2) 萬 / k notation
  const wan = text.match(/(\d+(?:\.\d+)?)\s*萬/);
  if (wan && inRentRange(Math.round(parseFloat(wan[1]) * 10000))) return Math.round(parseFloat(wan[1]) * 10000);
  const k = text.match(/(?<![\d.])(\d{1,3}(?:\.\d+)?)\s*[kK](?![a-zA-Z])/);
  if (k && inRentRange(Math.round(parseFloat(k[1]) * 1000))) return Math.round(parseFloat(k[1]) * 1000);
  // 3) number followed by currency-ish suffix or preceded by $
  const suffixed = text.match(/(?:NT\$?|\$)\s*(\d{1,3}(?:,\d{3})+|\d{4,6})|(\d{1,3}(?:,\d{3})+|\d{4,6})\s*(?:元|塊|\/月|元\/月|每月|NTD)/);
  if (suffixed) {
    const n = toInt(suffixed[1] ?? suffixed[2]);
    if (inRentRange(n)) return n;
  }
  // 4) bare 4-5 digit number that is not part of a phone number, only if a room keyword exists
  if (/套房|雅房|整層|分租|出租|房/.test(text)) {
    for (const m of text.matchAll(/(?<![\d-])(\d{1,2},\d{3}|\d{4,5})(?![\d-])/g)) {
      const n = toInt(m[1]);
      if (inRentRange(n)) return n;
    }
  }
  return undefined;
}

export function extractRoomType(text: string): RoomType {
  if (/整層|整棟|整戶|住家/.test(text)) return '整層';
  if (/分租/.test(text)) return '分租';
  if (/雅房/.test(text)) return '雅房';
  if (/套房|studio/i.test(text)) return '套房';
  return '未知';
}

export function extractDistrict(text: string): { city?: string; district?: string } {
  const cityMatch = text.match(/(台北|臺北|新北)市?/);
  for (const d of ALL_DISTRICTS) {
    const bare = d.slice(0, -1);
    if (text.includes(d) || new RegExp(`(?<![\\u4e00-\\u9fa5])${bare}(?![\\u4e00-\\u9fa5])|[\\[\\/【]${bare}[\\]\\/】]|${bare}\\s|${bare}(?=套房|雅房|分租|整層|區)`).test(text)) {
      return { city: CITY_OF_DISTRICT[d], district: d };
    }
  }
  if (cityMatch) return { city: cityMatch[1].replace('臺', '台') + '市' };
  return {};
}

export function extractMrt(text: string): { mrtNearest?: string; mrtWalkMin?: number } {
  const out: { mrtNearest?: string; mrtWalkMin?: number } = {};
  // Prefer "捷運XX站"; otherwise a CJK run of 2–4 chars right before 站 at a CJK boundary.
  const st = text.match(/捷運\s*([一-龥]{2,6}?)站(?!牌)/) ?? text.match(/(?<![一-龥])(?:近|鄰近|靠近|離|距)?([一-龥]{2,4})站(?!牌|前|後)/);
  if (st) {
    const name = st[1].replace(/^(?:近|鄰近|靠近|離|距)/, '');
    if (name.length >= 2 && !/車$/.test(name)) out.mrtNearest = `${name}站`;
  }
  const walk = text.match(/(?:步行|走路|走|徒步)\s*(?:約|大約)?\s*(\d{1,2})\s*分/) ?? text.match(/捷運[^\d]{0,8}(\d{1,2})\s*分/);
  if (walk) out.mrtWalkMin = parseInt(walk[1], 10);
  return out;
}

export function extractPhone(text: string): string | undefined {
  const m = text.match(/(?:\+?886[-\s]?9|09)\d{2}[-\s]?\d{3}[-\s]?\d{3}/);
  if (!m) return undefined;
  const digits = m[0].replace(/\D/g, '');
  return digits.startsWith('886') ? '0' + digits.slice(3) : digits;
}

export function extractPetPolicy(text: string): PetPolicy {
  if (PET_DENY.test(text)) return 'not_allowed';
  if (PET_NEGOTIABLE.test(text)) return 'negotiable';
  if (PET_ALLOW.test(text)) return 'allowed';
  return 'unknown';
}

export function extractEquipment(text: string): string[] {
  const out: string[] = [];
  for (const [canonical, pattern] of EQUIPMENT_ALIASES) {
    const re = new RegExp(`${NEGATION_LOOKBEHIND}(?:${pattern})`, 'i');
    if (re.test(text)) out.push(canonical);
  }
  if (out.includes('變頻冷氣') && !out.includes('冷氣')) out.splice(out.indexOf('變頻冷氣') + 1, 0, '冷氣');
  return out;
}

export function extractFields(text: string): ExtractedFields {
  const layoutM = text.match(/([1-9])\s*房(?:\s*([1-2])\s*廳)?(?:\s*([1-3])\s*衛)?/);
  const layout = layoutM ? `${layoutM[1]}房${layoutM[2] ? layoutM[2] + '廳' : ''}${layoutM[3] ? layoutM[3] + '衛' : ''}` : undefined;
  const areaM = text.match(/(\d+(?:\.\d+)?)[ \t]*坪/);
  const depositM = text.match(/押(?:金)?\s*([一二兩1-3])(?!\d)\s*(?:個月|個|付)?/) ?? text.match(/押([一二兩1-3])付/);
  const mgmtM = text.match(/管理費\s*[：:]?\s*(\d{3,5})/);
  const mgmtFree = /(含|免)管理費/.test(text);
  const { city, district } = extractDistrict(text);
  const mrt = extractMrt(text);
  return {
    rent: extractRent(text),
    depositMonths: depositM ? (CN_NUM[depositM[1]] ?? parseInt(depositM[1], 10)) : undefined,
    managementFee: mgmtM ? parseInt(mgmtM[1], 10) : mgmtFree ? 0 : undefined,
    areaPing: areaM ? parseFloat(areaM[1]) : undefined,
    layout,
    roomType: extractRoomType(text),
    city,
    district,
    ...mrt,
    phone: extractPhone(text),
    petPolicy: extractPetPolicy(text),
    equipment: extractEquipment(text),
    bonusHits: [],
  };
}
