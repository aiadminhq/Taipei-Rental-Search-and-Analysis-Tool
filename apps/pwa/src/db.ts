import Dexie, { type EntityTable } from 'dexie';
import {
  DEFAULT_PROFILE, ExportFileSchema, ListingSchema, ProfileSchema, assignDedupeGroups, evaluate,
  type ExportFile, type InboxItem, type Listing, type Profile, type Status,
} from '@trsat/core';

interface ProfileRow { key: 'profile'; value: Profile; updatedAt: string }
interface MetaRow { key: string; value: string }
interface SyncLogRow { id?: number; at: string; kind: 'export' | 'import' | 'enrich'; detail: string }

export class TrsatDB extends Dexie {
  listings!: EntityTable<Listing, 'id'>;
  inbox!: EntityTable<InboxItem, 'id'>;
  profile!: EntityTable<ProfileRow, 'key'>;
  meta!: EntityTable<MetaRow, 'key'>;
  syncLog!: EntityTable<SyncLogRow, 'id'>;
  constructor(name = 'trsat') {
    super(name);
    this.version(1).stores({
      listings: 'id, status, source, district, updatedAt, dedupeGroupId',
      inbox: 'id, receivedAt',
      profile: 'key',
      meta: 'key',
      syncLog: '++id, at',
    });
  }
}

export const db = new TrsatDB();
const nowIso = () => new Date().toISOString();
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export async function getProfile(): Promise<Profile> {
  const row = await db.profile.get('profile');
  return row ? ProfileSchema.parse(row.value) : DEFAULT_PROFILE;
}

export async function saveProfile(p: Profile): Promise<void> {
  const value = ProfileSchema.parse(p);
  await db.transaction('rw', db.profile, db.listings, async () => {
    await db.profile.put({ key: 'profile', value, updatedAt: nowIso() });
    await recomputeRules(value);
  });
}

async function recomputeRules(profile: Profile): Promise<void> {
  const all = await db.listings.toArray();
  const at = nowIso();
  const groups = assignDedupeGroups(all);
  await db.listings.bulkPut(all.map((l) => ({ ...l, rule: evaluate(l, profile, at), dedupeGroupId: groups.get(l.id) })));
}

/** Fields the user owns in-app; re-sharing the same link must never clobber them. */
const USER_OWNED_FIELDS: readonly string[] = ['status', 'statusHistory', 'notes', 'pinned', 'enrichment'];

const isEmptyValue = (v: unknown): boolean =>
  v === undefined || v === null
  || (Array.isArray(v) && v.length === 0)
  || (typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length === 0);

/**
 * Merge a freshly parsed listing onto the stored row with the same id. Listing ids are
 * deterministic (`${source}:${sourceId}`), so a plain `put` of a re-shared link would wipe
 * everything the user has since done to it. Keep user-owned state as-is, and let an absent
 * or empty incoming field fall back to what we already hold (photos, enriched fields, …) —
 * the same "undefined never erases" policy `enrich()` applies to endpoint responses.
 */
export function mergeIncomingListing(cur: Listing, incoming: Listing): Listing {
  const next: Listing = { ...cur };
  for (const [k, v] of Object.entries(incoming)) {
    if (USER_OWNED_FIELDS.includes(k)) continue;
    if (isEmptyValue(v)) continue;
    (next as Record<string, unknown>)[k] = v;
  }
  return next;
}

export async function upsertListing(l: Listing): Promise<Listing> {
  const listing = ListingSchema.parse(l);
  return db.transaction('rw', db.profile, db.listings, async () => {
    const profile = await getProfile();
    const cur = await db.listings.get(listing.id);
    const merged = cur ? mergeIncomingListing(cur, listing) : listing;
    const withRule: Listing = { ...merged, rule: evaluate(merged, profile) };
    await db.listings.put(withRule);
    const all = await db.listings.toArray();
    const groups = assignDedupeGroups(all);
    const changed = all.filter((x) => x.dedupeGroupId !== groups.get(x.id)).map((x) => ({ ...x, dedupeGroupId: groups.get(x.id) }));
    if (changed.length) await db.listings.bulkPut(changed);
    return (await db.listings.get(withRule.id))!;
  });
}

export async function patchListing(id: string, patch: Partial<Listing>): Promise<void> {
  await db.transaction('rw', db.profile, db.listings, async () => {
    const cur = await db.listings.get(id);
    if (!cur) return;
    const profile = await getProfile();
    const next: Listing = { ...cur, ...patch, id, updatedAt: nowIso() };
    next.rule = evaluate(next, profile);
    await db.listings.put(ListingSchema.parse(next));
  });
}

export async function setStatus(id: string, status: Status, at: string = nowIso()): Promise<void> {
  const cur = await db.listings.get(id);
  if (!cur) return;
  await db.listings.put({ ...cur, status, statusHistory: [...cur.statusHistory, { status, at }], updatedAt: at });
}

export async function addInbox(item: Omit<InboxItem, 'id' | 'receivedAt'>): Promise<InboxItem> {
  const row: InboxItem = { id: uid(), receivedAt: nowIso(), ...item };
  await db.inbox.put(row);
  return row;
}
export async function removeInbox(id: string): Promise<void> { await db.inbox.delete(id); }

export async function getCompareIds(): Promise<string[]> {
  const row = await db.meta.get('compare');
  return row ? (JSON.parse(row.value) as string[]) : [];
}
export async function toggleCompare(id: string): Promise<string[]> {
  const cur = await getCompareIds();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 3 ? cur : [...cur, id];
  await db.meta.put({ key: 'compare', value: JSON.stringify(next) });
  return next;
}

export async function exportAll(): Promise<ExportFile> {
  const file: ExportFile = { version: 1, exportedAt: nowIso(), profile: await getProfile(), listings: await db.listings.toArray(), inbox: await db.inbox.toArray() };
  await db.syncLog.add({ at: file.exportedAt, kind: 'export', detail: `${file.listings.length} listings` });
  return file;
}

export async function importAll(raw: unknown): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const errors: string[] = [];
  const parsed = ExportFileSchema.safeParse(raw);
  if (!parsed.success) {
    // try to salvage individual listings
    const listings = (raw as { listings?: unknown[] })?.listings ?? [];
    const good: Listing[] = [];
    listings.forEach((l, i) => { const r = ListingSchema.safeParse(l); if (r.success) good.push(r.data); else errors.push(`listings[${i}]: ${r.error.issues[0]?.message ?? 'invalid'}`); });
    if (good.length === 0) { errors.unshift(`檔案格式不符：${parsed.error.issues[0]?.message ?? 'invalid'}`); return { imported: 0, skipped: 0, errors }; }
    return { ...(await mergeListings(good)), errors };
  }
  const data = parsed.data;
  // One transaction for the whole restore. The profile is written *first* because
  // mergeListings ends with recomputeRules(), which re-tiers every listing against
  // whatever profile is stored — so restoring it up front re-tiers in the same pass.
  const res = await db.transaction('rw', db.profile, db.listings, db.inbox, db.syncLog, async () => {
    await db.profile.put({ key: 'profile', value: ProfileSchema.parse(data.profile), updatedAt: nowIso() });
    if (data.inbox.length) await db.inbox.bulkPut(data.inbox);
    return mergeListings(data.listings);
  });
  return { ...res, errors };
}

async function mergeListings(incoming: Listing[]): Promise<{ imported: number; skipped: number }> {
  let imported = 0, skipped = 0;
  await db.transaction('rw', db.profile, db.listings, db.syncLog, async () => {
    const profile = await getProfile();
    for (const l of incoming) {
      const cur = await db.listings.get(l.id);
      if (cur && cur.updatedAt >= l.updatedAt) { skipped++; continue; }
      await db.listings.put({ ...l, rule: evaluate(l, profile) });
      imported++;
    }
    await recomputeRules(profile);
    await db.syncLog.add({ at: nowIso(), kind: 'import', detail: `${imported} imported, ${skipped} skipped` });
  });
  return { imported, skipped };
}

export async function clearAll(): Promise<void> {
  await db.transaction('rw', db.listings, db.inbox, db.profile, db.meta, db.syncLog, async () => {
    await Promise.all([db.listings.clear(), db.inbox.clear(), db.profile.clear(), db.meta.clear(), db.syncLog.clear()]);
  });
}
