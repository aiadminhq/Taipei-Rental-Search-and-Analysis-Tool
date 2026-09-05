import { STATUS_ORDER, type Status } from '@trsat/core';
import { STATUS_LABEL } from '../lib/format';
export function StatusStepper({ status, onChange }: { status: Status; onChange: (s: Status) => void }) {
  return (
    <div class="-mx-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="看房狀態">
      {STATUS_ORDER.filter((s) => s !== 'inbox').map((s) => (
        <button key={s} class={`tap shrink-0 rounded-full border px-3 text-xs ${s === status ? 'border-primary bg-primary text-white' : 'border-gray-300 dark:border-gray-700'}`} aria-pressed={s === status} onClick={() => onChange(s)}>
          {STATUS_LABEL[s]}
        </button>
      ))}
    </div>
  );
}
