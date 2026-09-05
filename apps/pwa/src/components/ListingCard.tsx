import { DEFAULT_PROFILE, type Listing } from '@trsat/core';
import { TierBadge } from './TierBadge';
import { formatRent, sourceLabel, STATUS_LABEL } from '../lib/format';

export function ListingCard({ listing: l, extraCount = 0, onClick }: { listing: Listing; extraCount?: number; onClick: () => void }) {
  const missing = DEFAULT_PROFILE.mustHave.filter((m) => !l.equipment.includes(m));
  const tags = l.equipment.slice(0, 3);
  return (
    <article class="rounded-xl border border-gray-200 bg-white p-3 shadow-sm active:bg-gray-50 dark:border-gray-800 dark:bg-gray-900" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}>
      <div class="flex items-start justify-between gap-2">
        <p class="text-xl font-bold">{formatRent(l.rent)}</p>
        <div class="flex items-center gap-1">
          {l.rule && <TierBadge tier={l.rule.tier} size="sm" />}
          <span class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] dark:bg-gray-800">{STATUS_LABEL[l.status]}</span>
        </div>
      </div>
      <p class="mt-1 truncate text-sm text-gray-700 dark:text-gray-300">
        {[l.district, l.roomType !== '未知' ? l.roomType : null, l.areaPing ? `${l.areaPing}坪` : null, l.mrtWalkMin !== undefined ? `捷運 ${l.mrtWalkMin} 分` : null].filter(Boolean).join(' · ') || l.title}
      </p>
      <p class="mt-1 flex flex-wrap gap-1 text-xs">
        <span class="text-gray-400">{sourceLabel(l.source)}</span>
        {tags.map((t) => <span key={t} class="rounded bg-gray-100 px-1.5 dark:bg-gray-800">{t}</span>)}
        {tags.length === 0 && missing.slice(0, 2).map((m) => <span key={m} class="text-red-600">缺{m}</span>)}
        {l.enrichment === 'pending' && <span class="text-tier-unknown">待電腦補抓</span>}
        {extraCount > 0 && <span class="text-primary">+{extraCount} 同房源</span>}
      </p>
    </article>
  );
}
