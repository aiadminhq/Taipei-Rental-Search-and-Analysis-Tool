export const TAIPEI_DISTRICTS = ['中正', '大同', '中山', '松山', '大安', '萬華', '信義', '士林', '北投', '內湖', '南港', '文山'];
export const NEW_TAIPEI_DISTRICTS = ['板橋', '三重', '中和', '永和', '新莊', '新店', '樹林', '鶯歌', '三峽', '淡水', '汐止', '瑞芳', '土城', '蘆洲', '五股', '泰山', '林口', '深坑', '石碇', '坪林', '三芝', '石門', '八里', '平溪', '雙溪', '貢寮', '金山', '萬里', '烏來'];

export const CITY_OF_DISTRICT: Record<string, '台北市' | '新北市'> = Object.fromEntries([
  ...TAIPEI_DISTRICTS.map((d) => [`${d}區`, '台北市'] as const),
  ...NEW_TAIPEI_DISTRICTS.map((d) => [`${d}區`, '新北市'] as const),
]);
export const ALL_DISTRICTS = Object.keys(CITY_OF_DISTRICT);

/** canonical name → alias regex source (word must not be negated) */
export const EQUIPMENT_ALIASES: Array<[canonical: string, pattern: string]> = [
  ['變頻冷氣', '變頻(?:冷氣|空調)?'],
  ['冷氣', '冷氣|空調'],
  ['冰箱', '(?:電)?冰箱'],
  ['洗衣機', '洗衣機?'],
  ['對外窗', '對外窗|採光窗|大窗|落地窗'],
  ['電梯', '電梯'],
  ['陽台', '陽台'],
  ['露台', '露台|平台'],
  ['熱水器', '熱水器'],
  ['網路', '網路|wifi|光纖'],
  ['第四台', '第四台|有線電視'],
  ['電視', '電視'],
  ['床', '雙人床|單人床|床架|床墊'],
  ['衣櫃', '衣櫃|衣櫥'],
  ['書桌', '書桌|桌椅'],
  ['沙發', '沙發'],
  ['廚房', '廚房|可開伙|可煮'],
  ['烘衣機', '烘衣機|乾衣機'],
  ['乾濕分離', '乾濕分離'],
  ['微波爐', '微波爐'],
];
export const EQUIPMENT_CANONICAL = EQUIPMENT_ALIASES.map(([c]) => c);

export const NEGATION_LOOKBEHIND = '(?<!無|沒有|沒|不含|不提供|非)';

export const PET_DENY = /不可養寵|禁止寵物|禁寵|不能養寵|謝絕寵物|寵物不可|不接受寵物|不可養貓|不可養狗|寵物勿/;
export const PET_NEGOTIABLE = /寵物可議|寵物另議|寵物需洽|寵物可談|寵物再議/;
export const PET_ALLOW = /可養寵|寵物友善|可養貓|可養狗|接受寵物|可寵|歡迎寵物|可養小型/;

export const CN_NUM: Record<string, number> = { 一: 1, 二: 2, 兩: 2, 三: 3, 四: 4, 五: 5, 六: 6 };
