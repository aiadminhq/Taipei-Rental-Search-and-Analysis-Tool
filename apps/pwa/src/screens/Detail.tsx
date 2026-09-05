import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { ALL_DISTRICTS, PetPolicySchema, RoomTypeSchema, type Listing, type PetPolicy, type RoomType } from '@trsat/core';
import { db, patchListing, setStatus, toggleCompare, getCompareIds } from '../db';
import { useLive } from '../hooks';
import { navigate } from '../router';
import { TierBadge } from '../components/TierBadge';
import { RuleChecklist } from '../components/RuleChecklist';
import { StatusStepper } from '../components/StatusStepper';
import { showToast } from '../components/Toast';
import { formatArea, formatRent, mapsUrl, sourceLabel } from '../lib/format';
import { enrich, getEndpoint } from '../lib/enrich';

const PET_LABEL: Record<PetPolicy, string> = { allowed: '可養', not_allowed: '不可', negotiable: '可議', unknown: '未提及' };

export function DetailScreen({ id }: { id: string }) {
  const l = useLive(() => db.listings.get(id), [id], undefined as Listing | undefined);
  const compare = useLive(() => getCompareIds(), [], [] as string[]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<Listing>>({});
  if (l === undefined) return <main class="mx-auto max-w-lg p-4 pb-24"><p class="text-gray-500">找不到房源。</p><button class="tap mt-2 rounded-lg border px-3" onClick={() => navigate('/')}>回清單</button></main>;

  const num = (v: string) => { const n = parseFloat(v); return Number.isFinite(n) ? n : undefined; };
  const save = async () => { await patchListing(l.id, draft); setDraft({}); setEditing(false); showToast('已更新', 'success'); };
  const copyContact = async () => { if (l.contactRaw) { await navigator.clipboard.writeText(l.contactRaw); showToast('已複製聯絡方式'); } };
  const doEnrich = async () => {
    if (!l.url) return showToast('沒有原始連結，無法補抓', 'error');
    if (!(await getEndpoint())) {
      const cmd = `trsat fetch "${l.url}"`;
      await navigator.clipboard?.writeText(cmd).catch(() => undefined);
      await enrich(l.id);
      return showToast('未設定補抓 endpoint，已複製指令到剪貼簿，請在電腦執行', 'info');
    }
    const r = await enrich(l.id);
    showToast(r === 'done' ? '補抓完成' : r === 'failed' ? '補抓失敗' : '已標記待補抓', r === 'done' ? 'success' : 'error');
  };

  const fact = (label: string, value: string, _key?: keyof Listing, input?: JSX.Element) => (
    <div class="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
      <dt class="text-[11px] text-gray-500">{label}</dt>
      <dd class="text-sm font-medium">{editing && input ? input : value}</dd>
    </div>
  );
  const d = { ...l, ...draft };

  return (
    <main class="mx-auto max-w-lg pb-40">
      <div class="flex items-center gap-2 p-3"><button class="tap px-2" onClick={() => navigate('/')} aria-label="返回">←</button><span class="text-xs text-gray-500">{sourceLabel(l.source)}</span>{l.rule && <TierBadge tier={l.rule.tier} />}</div>

      {l.photos.length > 0 ? (
        <div class="flex snap-x snap-mandatory gap-2 overflow-x-auto px-4">{l.photos.map((p) => <img key={p} src={p} alt="" class="h-56 w-[85%] shrink-0 snap-center rounded-xl object-cover" loading="lazy" />)}</div>
      ) : (
        <div class="mx-4 flex h-32 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500 dark:bg-gray-800">尚無照片 · {sourceLabel(l.source)}</div>
      )}

      <section class="p-4">
        <h1 class="text-lg font-bold">{l.title}</h1>
        <p class="my-2 text-3xl font-bold">{formatRent(l.rent)}<span class="ml-1 text-sm font-normal text-gray-500">/月</span></p>
        <div class="mb-2 flex justify-end"><button class="tap rounded-lg border px-3 text-xs" onClick={() => (editing ? save() : setEditing(true))}>{editing ? '儲存' : '編輯'}</button></div>
        <dl class="grid grid-cols-2 gap-2">
          {editing && fact('租金', formatRent(l.rent), 'rent', <input aria-label="租金" type="number" class="w-full rounded border px-1 dark:bg-gray-900" value={d.rent ?? ''} onInput={(e) => setDraft({ ...draft, rent: num((e.target as HTMLInputElement).value) })} />)}
          {fact('押金（月）', l.depositMonths?.toString() ?? '—', 'depositMonths', <input aria-label="押金" type="number" class="w-full rounded border px-1 dark:bg-gray-900" value={d.depositMonths ?? ''} onInput={(e) => setDraft({ ...draft, depositMonths: num((e.target as HTMLInputElement).value) })} />)}
          {fact('管理費', l.managementFee?.toString() ?? '—', 'managementFee', <input aria-label="管理費" type="number" class="w-full rounded border px-1 dark:bg-gray-900" value={d.managementFee ?? ''} onInput={(e) => setDraft({ ...draft, managementFee: num((e.target as HTMLInputElement).value) })} />)}
          {fact('房型', l.roomType, 'roomType', <select aria-label="房型" class="w-full rounded border dark:bg-gray-900" value={d.roomType} onChange={(e) => setDraft({ ...draft, roomType: (e.target as HTMLSelectElement).value as RoomType })}>{RoomTypeSchema.options.map((o) => <option key={o}>{o}</option>)}</select>)}
          {fact('坪數', formatArea(l.areaPing), 'areaPing', <input aria-label="坪數" type="number" step="0.5" class="w-full rounded border px-1 dark:bg-gray-900" value={d.areaPing ?? ''} onInput={(e) => setDraft({ ...draft, areaPing: num((e.target as HTMLInputElement).value) })} />)}
          {fact('樓層', l.floor ?? '—', 'floor', <input aria-label="樓層" class="w-full rounded border px-1 dark:bg-gray-900" value={d.floor ?? ''} onInput={(e) => setDraft({ ...draft, floor: (e.target as HTMLInputElement).value || undefined })} />)}
          {fact('區', l.district ?? '—', 'district', <select aria-label="區" class="w-full rounded border dark:bg-gray-900" value={d.district ?? ''} onChange={(e) => setDraft({ ...draft, district: (e.target as HTMLSelectElement).value || undefined })}><option value="">—</option>{ALL_DISTRICTS.map((o) => <option key={o}>{o}</option>)}</select>)}
          {fact('地址', l.address ?? '—', 'address', <input aria-label="地址" class="w-full rounded border px-1 dark:bg-gray-900" value={d.address ?? ''} onInput={(e) => setDraft({ ...draft, address: (e.target as HTMLInputElement).value || undefined })} />)}
          {fact('捷運', l.mrtNearest ? `${l.mrtNearest}${l.mrtWalkMin !== undefined ? ` · ${l.mrtWalkMin} 分` : ''}` : '—', 'mrtNearest', <input aria-label="捷運站" class="w-full rounded border px-1 dark:bg-gray-900" value={d.mrtNearest ?? ''} onInput={(e) => setDraft({ ...draft, mrtNearest: (e.target as HTMLInputElement).value || undefined })} />)}
          {fact('步行分', l.mrtWalkMin?.toString() ?? '—', 'mrtWalkMin', <input aria-label="步行分" type="number" class="w-full rounded border px-1 dark:bg-gray-900" value={d.mrtWalkMin ?? ''} onInput={(e) => setDraft({ ...draft, mrtWalkMin: num((e.target as HTMLInputElement).value) })} />)}
          {fact('寵物', PET_LABEL[l.petPolicy ?? 'unknown'], 'petPolicy', <select aria-label="寵物" class="w-full rounded border dark:bg-gray-900" value={d.petPolicy ?? 'unknown'} onChange={(e) => setDraft({ ...draft, petPolicy: (e.target as HTMLSelectElement).value as PetPolicy })}>{PetPolicySchema.options.map((o) => <option key={o} value={o}>{PET_LABEL[o]}</option>)}</select>)}
          {fact('可入住', l.availableFrom ?? '—', 'availableFrom', <input aria-label="可入住" type="date" class="w-full rounded border px-1 dark:bg-gray-900" value={d.availableFrom ?? ''} onInput={(e) => setDraft({ ...draft, availableFrom: (e.target as HTMLInputElement).value || undefined })} />)}
        </dl>
      </section>

      <section class="px-4"><h2 class="mb-2 text-sm font-semibold">條件檢核</h2>{l.rule && <RuleChecklist result={l.rule} />}</section>

      <section class="p-4"><h2 class="mb-2 text-sm font-semibold">看房狀態</h2><StatusStepper status={l.status} onChange={(s) => setStatus(l.id, s)} /></section>

      <section class="px-4">
        <label class="text-sm font-semibold" for="notes">備註</label>
        <textarea id="notes" class="mt-1 h-24 w-full rounded-lg border p-2 text-sm dark:bg-gray-800" value={l.notes ?? ''} onBlur={(e) => patchListing(l.id, { notes: (e.target as HTMLTextAreaElement).value || undefined })} />
      </section>

      {l.rawText && <details class="px-4 py-2 text-sm text-gray-600"><summary>原文</summary><pre class="whitespace-pre-wrap">{l.rawText}</pre></details>}

      <div class="fixed inset-x-0 bottom-16 z-30 mx-auto grid max-w-lg grid-cols-5 gap-1 border-t bg-white p-2 text-xs dark:bg-gray-900" role="toolbar" aria-label="房源操作">
        <a class="tap flex items-center justify-center rounded-lg border" href={l.url} target="_blank" rel="noopener noreferrer" aria-disabled={!l.url}>開原文</a>
        <a class="tap flex items-center justify-center rounded-lg border" href={mapsUrl(l)} target="_blank" rel="noopener noreferrer">地圖</a>
        <button class="tap rounded-lg border disabled:opacity-40" disabled={!l.contactRaw} onClick={copyContact}>複製聯絡</button>
        <button class={`tap rounded-lg border ${compare.includes(l.id) ? 'bg-primary text-white' : ''}`} onClick={async () => { const n = await toggleCompare(l.id); showToast(n.includes(l.id) ? '已加入比較' : '已移出比較'); }}>比較</button>
        <button class="tap rounded-lg border" onClick={doEnrich}>{l.enrichment === 'pending' ? '待補抓' : '補抓'}</button>
      </div>
    </main>
  );
}
