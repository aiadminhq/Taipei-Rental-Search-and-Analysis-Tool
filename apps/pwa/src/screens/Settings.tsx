import { useEffect, useState } from 'preact/hooks';
import { DEFAULT_PROFILE, ProfileSchema, type Profile } from '@trsat/core';
import { clearAll, db, exportAll, getProfile, importAll, saveProfile } from '../db';
import { useLive } from '../hooks';
import { getEndpoint, setEndpoint, testEndpoint } from '../lib/enrich';
import { downloadJson, readJsonFile, splitTags } from '../lib/file';
import { showToast } from '../components/Toast';

const APP_VERSION = (import.meta.env.VITE_APP_VERSION as string | undefined) ?? '0.1.0';

export function SettingsScreen() {
  const [p, setP] = useState<Profile>(DEFAULT_PROFILE);
  const [endpoint, setEp] = useState('');
  const [busy, setBusy] = useState(false);
  const lastEnrich = useLive(async () => (await db.syncLog.orderBy('at').reverse().filter((r) => r.kind === 'enrich').first())?.at, [], undefined as string | undefined);
  useEffect(() => { getProfile().then(setP); getEndpoint().then((e) => setEp(e ?? '')); }, []);

  const numField = (label: string, value: number | undefined, onChange: (n: number | undefined) => void) => (
    <label class="flex flex-col text-xs text-gray-500">{label}
      <input aria-label={label} type="number" inputMode="numeric" class="tap mt-1 rounded border px-2 text-base text-gray-900 dark:bg-gray-800 dark:text-gray-100" value={value ?? ''}
        onInput={(e) => { const n = parseInt((e.target as HTMLInputElement).value, 10); onChange(Number.isFinite(n) ? n : undefined); }} />
    </label>
  );
  const tagField = (label: string, value: string[], onChange: (v: string[]) => void) => (
    <label class="flex flex-col text-xs text-gray-500">{label}
      <textarea aria-label={label} class="mt-1 h-16 rounded border p-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100" value={value.join('、')} onBlur={(e) => onChange(splitTags((e.target as HTMLTextAreaElement).value.replace(/、/g, ',')))} />
    </label>
  );

  const save = async () => {
    const r = ProfileSchema.safeParse(p);
    if (!r.success) return showToast(`條件有誤：${r.error.issues[0]?.message}`, 'error');
    setBusy(true); await saveProfile(r.data); setBusy(false); showToast('已儲存並重新分級', 'success');
  };
  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try { const r = await importAll(await readJsonFile(file)); showToast(`匯入 ${r.imported} 筆，略過 ${r.skipped} 筆${r.errors.length ? `，${r.errors.length} 筆錯誤` : ''}`, r.errors.length ? 'error' : 'success'); }
    catch { showToast('不是有效的 JSON 檔', 'error'); }
  };
  const wipe = async () => {
    if (!confirm('確定要清除所有房源、收件匣與設定？')) return;
    if (!confirm('再次確認：此操作無法復原。建議先匯出備份。')) return;
    await clearAll(); showToast('已清除');
  };

  return (
    <main class="mx-auto max-w-lg space-y-6 p-4 pb-24">
      <h1 class="text-xl font-bold">設定</h1>

      <section class="space-y-3">
        <h2 class="text-sm font-semibold">個人條件</h2>
        <div class="grid grid-cols-2 gap-2">
          {numField('套房預算上限', p.budget.套房, (n) => setP({ ...p, budget: { ...p.budget, 套房: n ?? 0 } }))}
          {numField('雅房預算上限', p.budget.雅房, (n) => setP({ ...p, budget: { ...p.budget, 雅房: n ?? 0 } }))}
          {numField('整層預算上限（選填）', p.budget.整層, (n) => setP({ ...p, budget: { ...p.budget, 整層: n } }))}
          {numField('分租預算上限（選填，預設同套房）', p.budget.分租, (n) => setP({ ...p, budget: { ...p.budget, 分租: n } }))}
          {numField('預算容忍（元）', p.budgetTolerance, (n) => setP({ ...p, budgetTolerance: n ?? 0 }))}
          {numField('捷運步行上限（分）', p.mrtWalkMaxMin, (n) => setP({ ...p, mrtWalkMaxMin: n ?? 15 }))}
        </div>
        <fieldset class="text-xs text-gray-500"><legend>城市</legend>
          {['台北市', '新北市'].map((c) => (
            <label key={c} class="mr-4 inline-flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100"><input type="checkbox" checked={p.cities.includes(c)} onChange={() => setP({ ...p, cities: p.cities.includes(c) ? p.cities.filter((x) => x !== c) : [...p.cities, c] })} />{c}</label>
          ))}
        </fieldset>
        <label class="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={p.pets.required} onChange={() => setP({ ...p, pets: { ...p.pets, required: !p.pets.required } })} />需可養寵物</label>
        <input aria-label="寵物備註" class="tap w-full rounded border px-2 text-sm dark:bg-gray-800" placeholder="寵物備註，例：2 隻貓" value={p.pets.note} onInput={(e) => setP({ ...p, pets: { ...p.pets, note: (e.target as HTMLInputElement).value } })} />
        {tagField('必備設備', p.mustHave, (v) => setP({ ...p, mustHave: v }))}
        {tagField('謝絕關鍵字', p.dealBreakerKeywords, (v) => setP({ ...p, dealBreakerKeywords: v }))}
        {tagField('加分關鍵字', p.bonusKeywords, (v) => setP({ ...p, bonusKeywords: v }))}
        <label class="flex flex-col text-xs text-gray-500">最晚入住日（選填）<input aria-label="最晚入住日" type="date" class="tap mt-1 rounded border px-2 text-base dark:bg-gray-800" value={p.moveInBefore ?? ''} onInput={(e) => setP({ ...p, moveInBefore: (e.target as HTMLInputElement).value || undefined })} /></label>
        <button class="tap w-full rounded-lg bg-primary text-sm font-medium text-white disabled:opacity-40" disabled={busy} onClick={save}>儲存條件</button>
      </section>

      <section class="space-y-2">
        <h2 class="text-sm font-semibold">補抓 endpoint（選填）</h2>
        <p class="text-xs text-gray-500">在電腦執行 <code>trsat serve</code> 並以 Tailscale Funnel 或 Cloudflare Tunnel 取得 HTTPS 網址後填入。未設定時，「補抓」只會複製指令。</p>
        <input aria-label="endpoint" class="tap w-full rounded border px-2 text-sm dark:bg-gray-800" placeholder="https://laptop.tailnet.ts.net" value={endpoint} onInput={(e) => setEp((e.target as HTMLInputElement).value)} />
        <p class="text-xs text-gray-500">上次補抓成功：{lastEnrich ? new Date(lastEnrich).toLocaleString('zh-TW') : '尚無'}</p>
        <div class="flex gap-2">
          <button class="tap flex-1 rounded-lg border text-sm" onClick={async () => { const ok = await testEndpoint(endpoint); showToast(ok ? '連線成功' : '連線失敗（請確認 HTTPS 網址與 trsat serve 是否執行）', ok ? 'success' : 'error'); }}>測試連線</button>
          <button class="tap flex-1 rounded-lg border text-sm" onClick={async () => {
            try { await setEndpoint(endpoint); showToast('已儲存 endpoint', 'success'); }
            catch (e) { showToast((e as Error).message, 'error'); }
          }}>儲存</button>
        </div>
      </section>

      <section class="space-y-2">
        <h2 class="text-sm font-semibold">資料</h2>
        <div class="grid grid-cols-2 gap-2">
          <button class="tap rounded-lg border text-sm" onClick={async () => downloadJson(`trsat-${new Date().toISOString().slice(0, 10)}.json`, await exportAll())}>匯出 JSON</button>
          <label class="tap flex cursor-pointer items-center justify-center rounded-lg border text-sm">匯入 JSON<input type="file" accept="application/json,.json" class="hidden" onChange={(e) => onImport((e.target as HTMLInputElement).files?.[0])} /></label>
        </div>
        <button class="tap w-full rounded-lg border border-red-300 text-sm text-red-700" onClick={wipe}>清除所有資料</button>
      </section>

      <section class="text-xs text-gray-500"><p>TRSAT 租屋收件匣 v{APP_VERSION}</p><p>資料只存在此裝置。</p></section>
    </main>
  );
}
