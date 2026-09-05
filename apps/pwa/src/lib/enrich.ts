import { ListingSchema, type Listing } from '@trsat/core';
import { db, patchListing } from '../db';
import { showToast } from '../components/Toast';

export async function getEndpoint(): Promise<string | undefined> {
  return (await db.meta.get('endpoint'))?.value || undefined;
}
export async function setEndpoint(url: string): Promise<void> {
  await db.meta.put({ key: 'endpoint', value: url.trim().replace(/\/+$/, '') });
}
export async function testEndpoint(url: string): Promise<boolean> {
  try { const r = await fetch(`${url.replace(/\/+$/, '')}/api/health`, { method: 'GET' }); return r.ok; } catch { return false; }
}

const MERGEABLE: Array<keyof Listing> = ['title', 'rent', 'depositMonths', 'managementFee', 'utilitiesNote', 'roomType', 'layout', 'areaPing', 'floor', 'city', 'district', 'address', 'mrtNearest', 'mrtWalkMin', 'equipment', 'petPolicy', 'availableFrom', 'photos', 'photoHashes', 'contactRaw', 'phoneNormalized', 'rawText', 'postedAt'];

export async function enrich(id: string): Promise<'done' | 'pending' | 'failed'> {
  const cur = await db.listings.get(id);
  if (!cur?.url) return 'failed';
  const endpoint = await getEndpoint();
  if (!endpoint) { await patchListing(id, { enrichment: 'pending' }); return 'pending'; }
  try {
    const res = await fetch(`${endpoint}/api/fetch`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url: cur.url }) });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string; message?: string; listing?: Partial<Listing> };
    if (res.status === 401 && body.code === 'SESSION_EXPIRED') {
      showToast(`電腦端需重新登入：${body.message ?? ''}`, 'error');
      await patchListing(id, { enrichment: 'failed' });
      return 'failed';
    }
    if (!res.ok || !body.ok || !body.listing) { await patchListing(id, { enrichment: 'failed' }); return 'failed'; }
    const patch: Partial<Listing> = {};
    for (const k of MERGEABLE) {
      const v = body.listing[k];
      if (v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)) (patch as Record<string, unknown>)[k] = v;
    }
    const merged: Listing = { ...cur, ...patch, enrichment: 'done', fetchedAt: new Date().toISOString(), extraction: { method: 'cli_fetch', confidence: 0.95, missing: [] } };
    ListingSchema.parse(merged);
    await patchListing(id, merged);
    await db.syncLog.add({ at: merged.fetchedAt, kind: 'enrich', detail: id });
    return 'done';
  } catch {
    await patchListing(id, { enrichment: 'failed' });
    return 'failed';
  }
}
