import { useEffect, useState } from 'preact/hooks';

type Kind = 'info' | 'success' | 'error';
interface ToastMsg { id: number; message: string; kind: Kind; action?: { label: string; onClick: () => void } }
const listeners = new Set<(m: ToastMsg) => void>();
let seq = 0;

export function showToast(message: string, kind: Kind = 'info', action?: ToastMsg['action']): void {
  const m: ToastMsg = { id: ++seq, message, kind, action };
  listeners.forEach((l) => l(m));
}

export function ToastHost() {
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    const on = (m: ToastMsg) => {
      setItems((xs) => [...xs, m]);
      if (!m.action) setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== m.id)), 3500);
    };
    listeners.add(on);
    return () => { listeners.delete(on); };
  }, []);
  const color: Record<Kind, string> = { info: 'bg-gray-800', success: 'bg-green-700', error: 'bg-red-700' };
  return (
    <div class="fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none" role="status" aria-live="polite">
      {items.map((m) => (
        <div key={m.id} class={`pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${color[m.kind]}`}>
          <span>{m.message}</span>
          {m.action && (
            <button class="tap rounded bg-white/20 px-3 font-medium" onClick={() => { m.action!.onClick(); setItems((xs) => xs.filter((x) => x.id !== m.id)); }}>
              {m.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
