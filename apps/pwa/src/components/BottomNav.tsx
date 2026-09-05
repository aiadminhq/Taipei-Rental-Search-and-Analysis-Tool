import { navigate } from '../router';

const TABS = [
  { path: '/inbox', label: '收件匣', icon: '📥' },
  { path: '/', label: '房源', icon: '🏠' },
  { path: '/compare', label: '比較', icon: '⚖️' },
  { path: '/settings', label: '設定', icon: '⚙️' },
];

export function BottomNav({ active, inboxCount }: { active: string; inboxCount: number }) {
  return (
    <nav class="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur safe-bottom dark:border-gray-800 dark:bg-gray-900/95" aria-label="主要導覽">
      <ul class="mx-auto grid max-w-lg grid-cols-4">
        {TABS.map((t) => {
          const isActive = t.path === '/' ? active === '/' || active.startsWith('/l/') : active.startsWith(t.path);
          return (
            <li key={t.path}>
              <button
                class={`tap relative flex w-full flex-col items-center justify-center py-2 text-xs ${isActive ? 'text-primary font-semibold' : 'text-gray-500'}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => navigate(t.path)}
              >
                <span class="text-xl" aria-hidden="true">{t.icon}</span>
                <span>{t.label}</span>
                {t.path === '/inbox' && inboxCount > 0 && (
                  <span class="absolute right-1/4 top-1 rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">{inboxCount}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
