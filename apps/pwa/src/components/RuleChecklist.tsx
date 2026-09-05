import type { RuleResult } from '@trsat/core';
const icon = { pass: '✓', unknown: '?', fail: '✗', bonus: '＋' } as const;
const color = { pass: 'text-tier-pass', unknown: 'text-tier-unknown', fail: 'text-red-600', bonus: 'text-primary' } as const;
export function RuleChecklist({ result, compact = false }: { result: RuleResult; compact?: boolean }) {
  const order = { fail: 0, unknown: 1, bonus: 2, pass: 3 };
  const items = [...result.reasons].sort((a, b) => order[a.kind] - order[b.kind]);
  const shown = compact ? items.filter((r) => r.kind !== 'pass').slice(0, 3) : items;
  return (
    <ul class={`space-y-1 ${compact ? 'text-xs' : 'text-sm'}`} aria-label="條件檢核">
      {shown.map((r) => (
        <li key={r.code} class="flex gap-2"><span class={`w-4 font-bold ${color[r.kind]}`} aria-hidden="true">{icon[r.kind]}</span><span>{r.message}</span></li>
      ))}
      {shown.length === 0 && <li class="text-gray-500">全部條件符合</li>}
    </ul>
  );
}
