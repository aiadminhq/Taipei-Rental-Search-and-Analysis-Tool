import { render } from 'preact';
import { registerSW } from 'virtual:pwa-register';
import './styles.css';
import { App } from './app';
import { showToast } from './components/Toast';

const updateSW = registerSW({
  onNeedRefresh() {
    showToast('有新版本可用', 'info', { label: '更新', onClick: () => void updateSW(true) });
  },
});

if (navigator.storage?.persist) navigator.storage.persist().catch(() => undefined);

render(<App />, document.getElementById('app')!);
