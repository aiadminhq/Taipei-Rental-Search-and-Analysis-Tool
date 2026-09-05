import { TIER_LABEL, type Tier } from '@trsat/core';
const cls: Record<Tier, string> = { pass: 'bg-tier-pass', unknown: 'bg-tier-unknown', fail: 'bg-tier-fail' };
export function TierBadge({ tier, size = 'md' }: { tier: Tier; size?: 'sm' | 'md' }) {
  return <span class={`inline-flex items-center rounded-full text-white ${cls[tier]} ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs font-medium'}`}>{TIER_LABEL[tier]}</span>;
}
