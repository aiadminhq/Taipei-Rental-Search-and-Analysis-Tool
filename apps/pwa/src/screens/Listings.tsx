import { useMemo, useState } from 'preact/hooks';
import { RoomTypeSchema, SourceSchema, StatusSchema, type Listing } from '@trsat/core';
import { db } from '../db';
import { useLive } from '../hooks';
import { navigate } from '../router';
import { ListingCard } from '../components/ListingCard';
import { applyFilters, groupByDedupe, sortListings, type Filters } from '../lib/sort';
import { STATUS_LABEL, sourceLabel } from '../lib/format';

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return <button class={`tap shrink-0 rounded-full border px-3 text-xs ${active ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-700'}`} onClick={onClick} aria-pressed={active}>{label}</button>;
}

export function ListingsScreen() {
  const all = useLive(() => db.listings.toArray(), [], [] as Listing[]);
  const [f, setF] = useState<Filters>({});
  const [showFail, setShowFail] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const districts = useMemo(() => [...new Set(all.map((l) => l.district).filter(Boolean) as string[])].sort(), [all]);
  const filtered = useMemo(() => sortListings(applyFilters(all, f)), [all, f]);
  const good = groupByDedupe(filtered.filter((l) => l.rule?.tier !== 'fail'));
  const bad = filtered.filter((l) => l.rule?.tier === 'fail');
  const open = (id: string) => navigate(`/l/${encodeURIComponent(id)}`);
  const toggle = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((x) => ({ ...x, [k]: x[k] === v ? undefined : v }));

  return (
    <main class="mx-auto max-w-lg p-4 pb-24">
      <h1 class="mb-2 text-xl font-bold">房源</h1>
      <div class="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="篩選">
        <Chip active={f.tier === 'pass'} label="符合" onClick={() => toggle('tier', 'pass')} />
        <Chip active={f.tier === 'unknown'} label="待確認" onClick={() => toggle('tier', 'unknown')} />
        {StatusSchema.options.filter((s) => s !== 'inbox').map((s) => <Chip key={s} active={f.status === s} label={STATUS_LABEL[s]} onClick={() => toggle('status', s)} />)}
        {RoomTypeSchema.options.filter((r) => r !== '未知').map((r) => <Chip key={r} active={f.roomType === r} label={r} onClick={() => toggle('roomType', r)} />)}
        {districts.map((d) => <Chip key={d} active={f.district === d} label={d} onClick={() => toggle('district', d)} />)}
        {SourceSchema.options.filter((s) => all.some((l) => l.source === s)).map((s) => <Chip key={s} active={f.source === s} label={sourceLabel(s)} onClick={() => toggle('source', s)} />)}
        <Chip active={!!f.pendingOnly} label="待補抓" onClick={() => setF((x) => ({ ...x, pendingOnly: !x.pendingOnly }))} />
      </div>

      {all.length === 0 && <p class="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">還沒有房源。從收件匣加入，或用分享選單把連結送進來。</p>}

      <ul class="space-y-3">
        {good.map(({ rep, others }) => (
          <li key={rep.id}>
            <ListingCard listing={rep} extraCount={others.length} onClick={() => open(rep.id)} />
            {others.length > 0 && (
              <button class="tap mt-1 text-xs text-primary" onClick={() => setExpanded((s) => { const n = new Set(s); n.has(rep.id) ? n.delete(rep.id) : n.add(rep.id); return n; })}>
                {expanded.has(rep.id) ? '收合同房源' : `展開 ${others.length} 筆同房源`}
              </button>
            )}
            {expanded.has(rep.id) && <ul class="mt-2 space-y-2 pl-3">{others.map((o) => <li key={o.id}><ListingCard listing={o} onClick={() => open(o.id)} /></li>)}</ul>}
          </li>
        ))}
      </ul>

      {bad.length > 0 && (
        <section class="mt-6">
          <button class="tap w-full rounded-lg border px-3 text-left text-sm text-gray-500" onClick={() => setShowFail((s) => !s)} aria-expanded={showFail}>
            {showFail ? '▾' : '▸'} 不符 ({bad.length})
          </button>
          {showFail && <ul class="mt-2 space-y-2 opacity-80">{bad.map((l) => <li key={l.id}><ListingCard listing={l} onClick={() => open(l.id)} /></li>)}</ul>}
        </section>
      )}
    </main>
  );
}
