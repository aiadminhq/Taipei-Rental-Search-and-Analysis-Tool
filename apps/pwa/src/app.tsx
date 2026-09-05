import { useEffect } from 'preact/hooks';
import { useHashRoute } from './router';
import { BottomNav } from './components/BottomNav';
import { ToastHost } from './components/Toast';
import { ShareScreen } from './screens/Share';
import { InboxScreen } from './screens/Inbox';
import { ListingsScreen } from './screens/Listings';
import { readSharePayload, stashShare } from './lib/share';
import { useLive } from './hooks';
import { db } from './db';

function Placeholder({ name }: { name: string }) {
  return <main class="mx-auto max-w-lg p-4 pb-24"><h1 class="text-xl font-bold">{name}</h1></main>;
}

export function App() {
  const route = useHashRoute();
  const inboxCount = useLive(() => db.inbox.count(), [], 0);

  useEffect(() => {
    const p = readSharePayload(location.search);
    if (p) {
      stashShare(p);
      history.replaceState(null, '', `${location.pathname}#/share`);
      dispatchEvent(new HashChangeEvent('hashchange'));
    }
  }, []);

  let screen;
  if (route.path === '/share') screen = <ShareScreen />;
  else if (route.path === '/inbox') screen = <InboxScreen query={route.query} />;
  else if (route.path === '/compare') screen = <Placeholder name="比較" />;
  else if (route.path === '/settings') screen = <Placeholder name="設定" />;
  else screen = <ListingsScreen />;

  return (
    <>
      {screen}
      <BottomNav active={route.path} inboxCount={inboxCount} />
      <ToastHost />
    </>
  );
}
