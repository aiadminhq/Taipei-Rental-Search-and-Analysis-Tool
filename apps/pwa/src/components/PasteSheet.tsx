import { useState } from 'preact/hooks';
import type { SharePayload } from '../lib/share';

export function PasteSheet({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (p: SharePayload) => void }) {
  const [text, setText] = useState('');
  if (!open) return null;
  const readClipboard = async () => {
    try { setText((await navigator.clipboard.readText()) ?? ''); } catch { /* permission denied: user types manually */ }
  };
  return (
    <div class="fixed inset-0 z-50 flex items-end bg-black/40" role="dialog" aria-modal="true" aria-label="貼上房源">
      <div class="w-full rounded-t-2xl bg-white p-4 safe-bottom dark:bg-gray-900">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-base font-semibold">貼上連結或貼文</h2>
          <button class="tap px-2 text-gray-500" onClick={onClose} aria-label="關閉">✕</button>
        </div>
        <textarea class="mb-3 h-40 w-full rounded-lg border p-3 text-sm dark:bg-gray-800" placeholder="貼上 591 / Threads / FB / PTT 連結，或整段貼文文字"
          value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} aria-label="貼上內容" />
        <div class="flex gap-2">
          <button class="tap flex-1 rounded-lg border px-3 text-sm" onClick={readClipboard}>從剪貼簿讀取</button>
          <button class="tap flex-1 rounded-lg bg-primary px-3 text-sm font-medium text-white disabled:opacity-40" disabled={!text.trim()}
            onClick={() => { onSubmit({ text: text.trim() }); setText(''); }}>解析</button>
        </div>
      </div>
    </div>
  );
}
