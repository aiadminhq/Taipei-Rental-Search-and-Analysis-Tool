import { useState } from 'preact/hooks';
import { db } from '../db';
import { navigate } from '../router';

export async function isOnboarded(): Promise<boolean> { return !!(await db.meta.get('onboarded')); }
export async function setOnboarded(): Promise<void> { await db.meta.put({ key: 'onboarded', value: new Date().toISOString() }); }
export function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  return /iP(hone|ad|od)/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);
}

const STEPS = [
  { title: '安裝到主畫面', body: (ios: boolean) => (ios ? '在 Safari 點「分享」→「加入主畫面」。安裝後才能離線使用。' : '在瀏覽器選單點「安裝應用程式」或「加入主畫面」。') },
  { title: '確認個人條件', body: () => '預算、必備設備、寵物、捷運距離與謝絕條件已預填，可在「設定」隨時修改。所有分級都依此計算。' },
  { title: '試著分享一筆', body: (ios: boolean) => (ios ? 'iPhone 不支援分享到網頁 App：複製房源文字或連結後，到「收件匣」按「貼上文字或連結」。' : '在 591 / Threads / FB 按「分享」→ 選「租屋收件匣」，房源會立刻被解析與分級。') },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const ios = isIosSafari();
  const last = i === STEPS.length - 1;
  return (
    <main class="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
      <p class="mb-2 text-xs text-gray-500">步驟 {i + 1} / {STEPS.length}</p>
      <h1 class="mb-3 text-2xl font-bold">{STEPS[i].title}</h1>
      <p class="mb-8 text-base text-gray-700 dark:text-gray-300">{STEPS[i].body(ios)}</p>
      <div class="flex gap-2">
        {i === 1 && <button class="tap flex-1 rounded-lg border text-sm" onClick={async () => { await setOnboarded(); onDone(); navigate('/settings'); }}>先去設定</button>}
        <button class="tap flex-1 rounded-lg bg-primary text-sm font-medium text-white" onClick={async () => { if (last) { await setOnboarded(); onDone(); } else setI(i + 1); }}>{last ? '開始使用' : '下一步'}</button>
      </div>
    </main>
  );
}
