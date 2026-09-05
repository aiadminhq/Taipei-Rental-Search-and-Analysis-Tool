import type { Listing, RoomType, Source, Status, Tier } from '@trsat/core';

const TIER_ORDER: Record<Tier, number> = { pass: 0, unknown: 1, fail: 2 };
export interface Filters { tier?: Tier; status?: Status; district?: string; roomType?: RoomType; source?: Source; pendingOnly?: boolean }

export function sortListings(list: Listing[]): Listing[] {
  return [...list].sort((a, b) =>
    TIER_ORDER[a.rule?.tier ?? 'unknown'] - TIER_ORDER[b.rule?.tier ?? 'unknown']
    || (b.rule?.softScore ?? 0) - (a.rule?.softScore ?? 0)
    || (a.rent ?? Infinity) - (b.rent ?? Infinity)
    || (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
}

export function applyFilters(list: Listing[], f: Filters): Listing[] {
  return list.filter((l) =>
    (!f.tier || l.rule?.tier === f.tier)
    && (!f.status || l.status === f.status)
    && (!f.district || l.district === f.district)
    && (!f.roomType || l.roomType === f.roomType)
    && (!f.source || l.source === f.source)
    && (!f.pendingOnly || l.enrichment === 'pending'));
}

export function groupByDedupe(list: Listing[]): Array<{ rep: Listing; others: Listing[] }> {
  const seen = new Map<string, { rep: Listing; others: Listing[] }>();
  const out: Array<{ rep: Listing; others: Listing[] }> = [];
  for (const l of list) {
    const key = l.dedupeGroupId ?? l.id;
    const g = seen.get(key);
    if (g) g.others.push(l);
    else { const ng = { rep: l, others: [] as Listing[] }; seen.set(key, ng); out.push(ng); }
  }
  return out;
}
