import type { Listing, Source, Status } from './schema';
import { extractFields, type ExtractedFields } from './extract';
import { extractFirstUrl, hashId, parseSourceUrl } from './source';

export interface ParseInput { url?: string; text?: string; title?: string }
export interface ParsedInput {
  source: Source;
  sourceId: string;
  url?: string;
  title: string;
  fields: ExtractedFields;
  rawText: string;
  extraction: Listing['extraction'];
}

export const REQUIRED_FIELDS = ['rent', 'roomType', 'district'] as const;

const WEIGHTS: Array<[key: keyof ExtractedFields, weight: number]> = [
  ['rent', 0.35], ['district', 0.2], ['roomType', 0.15], ['areaPing', 0.1], ['mrtNearest', 0.05], ['mrtWalkMin', 0.05], ['phone', 0.05], ['equipment', 0.05],
];

export function computeConfidence(fields: ExtractedFields): number {
  let c = 0;
  for (const [k, w] of WEIGHTS) {
    const v = fields[k];
    const present = Array.isArray(v) ? v.length > 0 : k === 'roomType' ? v !== '未知' : v !== undefined;
    if (present) c += w;
  }
  return Math.round(c * 100) / 100;
}

export function parseInput(input: ParseInput): ParsedInput {
  const text = (input.text ?? '').trim();
  const urlCandidate = input.url?.trim() || extractFirstUrl(text) || undefined;
  const ref = urlCandidate ? parseSourceUrl(urlCandidate) : null;

  let source: Source = ref?.source ?? 'manual';
  let sourceId = ref?.sourceId ?? '';
  if (!ref) {
    if (/看板\s*Rent_apart|\[(?:無|男|女)\/[一-龥]{2}\//.test(text)) source = 'ptt';
    sourceId = hashId(text || input.title || String(Date.now()));
  }

  const fields = extractFields([input.title ?? '', text].join('\n'));
  const firstLine = text.split('\n').map((s) => s.trim()).find((s) => s.length > 0 && !/^https?:\/\//.test(s));
  const title = (input.title?.trim() || firstLine || ref?.canonicalUrl || '未命名房源').slice(0, 80);

  const missing = REQUIRED_FIELDS.filter((k) => (k === 'roomType' ? fields.roomType === '未知' : fields[k] === undefined));
  const method: Listing['extraction']['method'] = text.length > 0 ? 'text_regex' : ref ? 'url' : 'manual';

  return {
    source, sourceId,
    url: ref?.canonicalUrl,
    title,
    fields,
    rawText: text,
    extraction: { method, confidence: computeConfidence(fields), missing: [...missing] },
  };
}

export function toListing(p: ParsedInput, now: string, status: Status = 'inbox'): Listing {
  const f = p.fields;
  return {
    id: `${p.source}:${p.sourceId}`,
    source: p.source,
    sourceId: p.sourceId,
    url: p.url,
    title: p.title,
    rent: f.rent,
    depositMonths: f.depositMonths,
    managementFee: f.managementFee,
    roomType: f.roomType,
    layout: f.layout,
    areaPing: f.areaPing,
    city: f.city,
    district: f.district,
    mrtNearest: f.mrtNearest,
    mrtWalkMin: f.mrtWalkMin,
    equipment: f.equipment,
    petPolicy: f.petPolicy,
    photos: [],
    contactRaw: f.phone,
    phoneNormalized: f.phone,
    rawText: p.rawText || undefined,
    fetchedAt: now,
    updatedAt: now,
    extraction: p.extraction,
    enrichment: 'none',
    status,
    statusHistory: [{ status, at: now }],
    pinned: false,
    extra: {},
  };
}
