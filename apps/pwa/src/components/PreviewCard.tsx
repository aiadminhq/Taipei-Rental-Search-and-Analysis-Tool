import type { JSX } from 'preact';
import { RoomTypeSchema, ALL_DISTRICTS, type Listing, type RoomType } from '@trsat/core';
import { TierBadge } from './TierBadge';
import { RuleChecklist } from './RuleChecklist';
import { formatRent, sourceLabel } from '../lib/format';

/**
 * `readOnly` renders the three fields as plain text instead of inputs. The inbox uses it:
 * there the card is inside a swipe row whose only edit affordance is an explicit 「編輯」
 * button, so a live input would capture a keystroke and then be navigated away from.
 */
export function PreviewCard({ listing, onChange, readOnly = false }: { listing: Listing; onChange?: (patch: Partial<Listing>) => void; readOnly?: boolean }) {
  const missing = new Set(listing.extraction.missing);
  const emit = (patch: Partial<Listing>) => onChange?.(patch);
  const field = (label: string, key: 'rent' | 'district' | 'roomType', input: JSX.Element, text: string) => (
    <label class={`flex flex-col gap-1 text-xs ${missing.has(key) ? 'text-tier-unknown' : 'text-gray-500'}`}>
      {label}{missing.has(key) && '（未偵測到，請補）'}
      {readOnly ? <span class="text-sm text-gray-900 dark:text-gray-100" aria-label={label}>{text}</span> : input}
    </label>
  );
  return (
    <section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900" aria-label="房源預覽">
      <div class="mb-2 flex items-center justify-between">
        <span class="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">{sourceLabel(listing.source)}</span>
        {listing.rule && <TierBadge tier={listing.rule.tier} />}
      </div>
      <h2 class="mb-1 line-clamp-2 text-base font-semibold">{listing.title}</h2>
      <p class="mb-3 text-2xl font-bold">{formatRent(listing.rent)}<span class="ml-1 text-sm font-normal text-gray-500">/月</span></p>
      <div class="mb-3 grid grid-cols-3 gap-2">
        {field('租金', 'rent', <input class="tap rounded border px-2 dark:bg-gray-800" type="number" inputMode="numeric" value={listing.rent ?? ''} aria-label="租金"
          onInput={(e) => { const v = parseInt((e.target as HTMLInputElement).value, 10); emit({ rent: Number.isFinite(v) && v > 0 ? v : undefined }); }} />,
          listing.rent !== undefined ? String(listing.rent) : '—')}
        {field('區', 'district', <select class="tap rounded border px-2 dark:bg-gray-800" value={listing.district ?? ''} aria-label="區"
          onChange={(e) => emit({ district: (e.target as HTMLSelectElement).value || undefined })}>
          <option value="">—</option>{ALL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}</select>, listing.district ?? '—')}
        {field('房型', 'roomType', <select class="tap rounded border px-2 dark:bg-gray-800" value={listing.roomType} aria-label="房型"
          onChange={(e) => emit({ roomType: (e.target as HTMLSelectElement).value as RoomType })}>
          {RoomTypeSchema.options.map((t) => <option key={t} value={t}>{t}</option>)}</select>, listing.roomType)}
      </div>
      {listing.rule && <RuleChecklist result={listing.rule} compact />}
    </section>
  );
}
