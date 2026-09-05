import type { Listing } from '@trsat/core';
import { db, getCompareIds, toggleCompare } from '../db';
import { useLive } from '../hooks';
import { navigate } from '../router';
import { TierBadge } from '../components/TierBadge';
import { formatArea, formatRent } from '../lib/format';

export function diffClass(values: string[], i: number): string {
  return new Set(values).size > 1 ? (i === 0 ? '' : 'bg-amber-50 dark:bg-amber-950/40') : '';
}

const PET: Record<string, string> = { allowed: '可養', not_allowed: '不可', negotiable: '可議', unknown: '未提及' };

export function CompareScreen() {
  const ids = useLive(() => getCompareIds(), [], [] as string[]);
  const items = useLive(async () => (await db.listings.bulkGet(ids)).filter((x): x is Listing => !!x), [ids.join(',')], [] as Listing[]);

  if (items.length === 0) return <main class="mx-auto max-w-lg p-4 pb-24"><h1 class="mb-2 text-xl font-bold">比較</h1><p class="text-sm text-gray-500">尚未選擇房源。到房源詳情按「比較」，最多 3 筆。</p></main>;

  const rows: Array<[label: string, get: (l: Listing) => string]> = [
    ['租金', (l) => formatRent(l.rent)],
    ['房型', (l) => l.roomType],
    ['坪數', (l) => formatArea(l.areaPing)],
    ['區', (l) => l.district ?? '—'],
    ['捷運', (l) => (l.mrtNearest ? `${l.mrtNearest}${l.mrtWalkMin !== undefined ? ` ${l.mrtWalkMin}分` : ''}` : '—')],
    ['押金', (l) => (l.depositMonths !== undefined ? `${l.depositMonths} 個月` : '—')],
    ['管理費', (l) => (l.managementFee !== undefined ? String(l.managementFee) : '—')],
    ['寵物', (l) => PET[l.petPolicy ?? 'unknown']],
    ['可入住', (l) => l.availableFrom ?? '—'],
    ['未符合／待確認', (l) => l.rule?.reasons.filter((r) => r.kind !== 'pass' && r.kind !== 'bonus').map((r) => r.message).join('、') || '無'],
  ];

  return (
    <main class="mx-auto max-w-lg p-4 pb-24">
      <h1 class="mb-3 text-xl font-bold">比較</h1>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr>
              <th class="w-20"></th>
              {items.map((l) => (
                <th key={l.id} class="min-w-36 px-2 pb-2 text-left align-top">
                  <button class="tap line-clamp-2 text-left font-semibold underline-offset-2 hover:underline" onClick={() => navigate(`/l/${encodeURIComponent(l.id)}`)}>{l.title}</button>
                  <div class="mt-1 flex items-center gap-2">{l.rule && <TierBadge tier={l.rule.tier} size="sm" />}<button class="tap text-xs text-gray-500" onClick={() => toggleCompare(l.id)}>移除</button></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, get]) => {
              const vals = items.map(get);
              return (
                <tr key={label} class="border-t border-gray-200 dark:border-gray-800">
                  <th class="py-2 pr-2 text-left text-xs font-medium text-gray-500">{label}</th>
                  {vals.map((v, i) => <td key={i} class={`px-2 py-2 ${diffClass(vals, i)}`}>{v}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
