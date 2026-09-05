import { useHashRoute } from './router';
import { BottomNav } from './components/BottomNav';
import { ToastHost } from './components/Toast';

function Placeholder({ name }: { name: string }) {
  return <main class="mx-auto max-w-lg p-4 pb-24"><h1 class="text-xl font-bold">{name}</h1></main>;
}

export function App() {
  const route = useHashRoute();
  let screen;
  if (route.path === '/inbox') screen = <Placeholder name="收件匣" />;
  else if (route.path === '/compare') screen = <Placeholder name="比較" />;
  else if (route.path === '/settings') screen = <Placeholder name="設定" />;
  else if (route.path === '/share') screen = <Placeholder name="分享接收" />;
  else screen = <Placeholder name="房源" />;
  return (
    <>
      {screen}
      <BottomNav active={route.path} inboxCount={0} />
      <ToastHost />
    </>
  );
}
