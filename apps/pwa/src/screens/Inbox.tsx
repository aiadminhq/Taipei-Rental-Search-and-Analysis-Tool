import { useEffect, useState } from 'preact/hooks';
import { DEFAULT_PROFILE, type InboxItem, type Profile } from '@trsat/core';
import { db, getProfile, removeInbox, upsertListing } from '../db';
import { useLive } from '../hooks';
import { PreviewCard } from '../components/PreviewCard';
import { PasteSheet } from '../components/PasteSheet';
import { SwipeCard } from '../components/SwipeCard';
import { showToast } from '../components/Toast';
import { buildPreview } from './Share';
import { stashShare } from '../lib/share';
import { navigate } from '../router';

export function InboxScreen({ query }: { query: URLSearchParams }) {
  const items = useLive(() => db.inbox.orderBy('receivedAt').reverse().toArray(), [], [] as InboxItem[]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [paste, setPaste] = useState(query.get('paste') === '1');
  useEffect(() => { getProfile().then(setProfile); }, []);

  const accept = async (it: InboxItem) => {
    await upsertListing(buildPreview(it, profile));
    await removeInbox(it.id);
    showToast('已加入房源', 'success');
  };
  const skip = async (it: InboxItem) => { await removeInbox(it.id); };

  return (
    <main class="mx-auto max-w-lg p-4 pb-24">
      <div class="mb-3 flex items-center justify-between">
        <h1 class="text-xl font-bold">收件匣</h1>
        <button class="tap rounded-lg border px-3 text-sm" onClick={() => setPaste(true)}>貼上文字或連結</button>
      </div>
      {items.length === 0 && (
        <div class="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
          <p class="mb-2">從 591 / Threads / FB 分享到此 App，房源會先出現在這裡。</p>
          <p>iPhone 請複製內容後點右上角「貼上文字或連結」。</p>
        </div>
      )}
      <ul class="space-y-3">
        {items.map((it) => (
          <li key={it.id}>
            <SwipeCard onSwipeRight={() => accept(it)} onSwipeLeft={() => skip(it)}>
              <PreviewCard listing={buildPreview(it, profile)} onChange={() => { stashShare(it); removeInbox(it.id); navigate('/share'); }} />
              <div class="mt-2 grid grid-cols-2 gap-2">
                <button class="tap rounded-lg border px-2 text-sm" onClick={() => skip(it)}>略過</button>
                <button class="tap rounded-lg bg-primary px-2 text-sm font-medium text-white" onClick={() => accept(it)}>加入</button>
              </div>
            </SwipeCard>
          </li>
        ))}
      </ul>
      <PasteSheet open={paste} onClose={() => setPaste(false)} onSubmit={(p) => { setPaste(false); stashShare(p); navigate('/share'); }} />
    </main>
  );
}
