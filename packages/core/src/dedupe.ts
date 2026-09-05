import type { Listing } from './schema';

export function normalizePhone(raw?: string): string | undefined {
  if (!raw) return undefined;
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('886')) d = '0' + d.slice(3);
  if (/^09\d{8}$/.test(d)) return d;          // mobile
  if (/^0[2-8]\d{7,8}$/.test(d)) return d;    // landline
  return undefined;
}

export function hammingHex(a: string, b: string): number {
  if (a.length !== b.length) return Number.POSITIVE_INFINITY;
  let n = 0;
  for (let i = 0; i < a.length; i++) {
    let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    while (x) { n += x & 1; x >>= 1; }
  }
  return n;
}

export const PHOTO_HAMMING_MAX = 6;

export function isLikelyDuplicate(a: Listing, b: Listing): 'phone' | 'photo' | 'fuzzy' | null {
  if (a.id === b.id) return null;
  const pa = normalizePhone(a.phoneNormalized ?? a.contactRaw);
  const pb = normalizePhone(b.phoneNormalized ?? b.contactRaw);
  if (pa && pb && pa === pb) return 'phone';
  for (const ha of a.photoHashes ?? []) for (const hb of b.photoHashes ?? []) {
    if (hammingHex(ha, hb) <= PHOTO_HAMMING_MAX) return 'photo';
  }
  if (a.district && a.district === b.district && a.rent !== undefined && b.rent !== undefined && Math.abs(a.rent - b.rent) <= 500) {
    const areaClose = a.areaPing === undefined || b.areaPing === undefined || Math.abs(a.areaPing - b.areaPing) <= 1;
    if (areaClose) return 'fuzzy';
  }
  return null;
}

export function assignDedupeGroups(all: Listing[]): Map<string, string> {
  const parent = new Map<string, string>(all.map((l) => [l.id, l.id]));
  const find = (x: string): string => { const p = parent.get(x)!; if (p === x) return x; const r = find(p); parent.set(x, r); return r; };
  const union = (x: string, y: string) => { const rx = find(x), ry = find(y); if (rx === ry) return; const [lo, hi] = rx < ry ? [rx, ry] : [ry, rx]; parent.set(hi, lo); };
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const kind = isLikelyDuplicate(all[i], all[j]);
    if (kind === 'phone' || kind === 'photo') union(all[i].id, all[j].id);
  }
  return new Map(all.map((l) => [l.id, find(l.id)]));
}
