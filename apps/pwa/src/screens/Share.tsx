import { useEffect, useMemo, useState } from 'preact/hooks';
import { DEFAULT_PROFILE, REQUIRED_FIELDS, evaluate, parseInput, toListing, type Listing, type Profile } from '@trsat/core';
import { addInbox, getProfile, upsertListing } from '../db';
import { navigate } from '../router';
import { takeShare, type SharePayload } from '../lib/share';
import { PreviewCard } from '../components/PreviewCard';
import { showToast } from '../components/Toast';

export function buildPreview(p: SharePayload, profile: Profile, now = new Date().toISOString()): Listing {
  const l = toListing(parseInput(p), now, 'shortlist');
  return { ...l, rule: evaluate(l, profile, now) };
}

export function ShareScreen({ payload }: { payload?: SharePayload }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [share] = useState<SharePayload | null>(() => payload ?? takeShare());
  const [edits, setEdits] = useState<Partial<Listing>>({});
  useEffect(() => { getProfile().then(setProfile); }, []);

  const listing = useMemo(() => {
    if (!share) return null;
    const base = buildPreview(share, profile);
    const merged: Listing = { ...base, ...edits };
    const missing = base.extraction.missing.filter((k) => (k === 'roomType' ? merged.roomType === '未知' : (merged as Record<string, unknown>)[k] === undefined));
    return { ...merged, extraction: { ...merged.extraction, method: Object.keys(edits).length ? 'manual' : merged.extraction.method, missing }, rule: evaluate(merged, profile) };
  }, [share, profile, edits]);

  if (!share || !listing) {
    return <main class="mx-auto max-w-lg p-4 pb-24"><p class="text-gray-500">沒有待處理的分享內容。</p><button class="tap mt-3 rounded-lg border px-4" onClick={() => navigate('/inbox')}>前往收件匣</button></main>;
  }

  // 信心不足時，只要使用者已補上任一必要欄位（租金／區／房型任一）即可解鎖 —
  // 而非要求三項全補齊，呼應下方提示文案「請至少補一個必要欄位」。
  const lowConfidence = listing.extraction.confidence < 0.5 && listing.extraction.missing.length >= REQUIRED_FIELDS.length;

  const add = async () => {
    try { await upsertListing(listing); }
    catch (e) { showToast(`儲存失敗（${(e as Error).name === 'QuotaExceededError' ? '儲存空間不足，請先到設定匯出備份' : (e as Error).message}）`, 'error'); return; }
    showToast('已加入房源', 'success'); navigate('/', { replace: true });
  };
  const toInbox = async () => { await addInbox(share); showToast('已放入收件匣'); navigate('/inbox', { replace: true }); };
  const skip = () => navigate('/inbox', { replace: true });

  return (
    <main class="mx-auto max-w-lg p-4 pb-24">
      <h1 class="mb-3 text-lg font-bold">收到房源</h1>
      <PreviewCard listing={listing} onChange={(patch) => setEdits((e) => ({ ...e, ...patch }))} />
      {lowConfidence && <p class="mt-2 text-xs text-tier-unknown">解析信心不足，請至少補一個必要欄位（租金／區／房型）後再加入。</p>}
      <div class="mt-4 grid grid-cols-3 gap-2">
        <button class="tap rounded-lg border px-2 text-sm" onClick={skip}>略過</button>
        <button class="tap rounded-lg border px-2 text-sm" onClick={toInbox}>先放收件匣</button>
        <button class="tap rounded-lg bg-primary px-2 text-sm font-medium text-white disabled:opacity-40" disabled={lowConfidence} onClick={add}>加入房源</button>
      </div>
      {listing.rawText && <details class="mt-4 text-sm text-gray-600"><summary>原文</summary><pre class="whitespace-pre-wrap">{listing.rawText}</pre></details>}
    </main>
  );
}
