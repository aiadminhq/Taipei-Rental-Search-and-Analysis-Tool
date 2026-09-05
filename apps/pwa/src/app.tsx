import { useEffect } from 'preact/hooks';
import { matchPath, useHashRoute } from './router';
import { BottomNav } from './components/BottomNav';
import { ToastHost } from './components/Toast';
import { ShareScreen } from './screens/Share';
import { InboxScreen } from './screens/Inbox';
import { ListingsScreen } from './screens/Listings';
import { DetailScreen } from './screens/Detail';
import { CompareScreen } from './screens/Compare';
import { SettingsScreen } from './screens/Settings';
import { readSharePayload, stashShare } from './lib/share';
import { useLive } from './hooks';
import { db } from './db';

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
  const detail = matchPath('/l/:id', route.path);
  if (route.path === '/share') screen = <ShareScreen />;
  else if (detail) screen = <DetailScreen id={detail.id} />;
  else if (route.path === '/inbox') screen = <InboxScreen query={route.query} />;
  else if (route.path === '/compare') screen = <CompareScreen />;
  else if (route.path === '/settings') screen = <SettingsScreen />;
  else screen = <ListingsScreen />;

  return (
    <>
      {screen}
      <BottomNav active={route.path} inboxCount={inboxCount} />
      <ToastHost />
    </>
  );
}
