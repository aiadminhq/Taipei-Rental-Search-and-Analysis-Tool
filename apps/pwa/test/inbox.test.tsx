import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { InboxScreen } from '../src/screens/Inbox';
import { addInbox, clearAll, db } from '../src/db';

beforeEach(async () => { await clearAll(); location.hash = '#/inbox'; });

describe('InboxScreen', () => {
  it('shows empty state with paste button', async () => {
    render(<InboxScreen query={new URLSearchParams()} />);
    expect(await screen.findByText(/從 591 \/ Threads \/ FB 分享到此 App/)).toBeTruthy();
    expect(screen.getByRole('button', { name: '貼上文字或連結' })).toBeTruthy();
  });
  it('lists items with parsed preview; 加入 moves to listings, 略過 removes', async () => {
    await addInbox({ text: '大安區套房 14000 可養貓' });
    await addInbox({ text: '中和雅房 8000' });
    render(<InboxScreen query={new URLSearchParams()} />);
    await screen.findByText('NT$14,000');
    const addButtons = await screen.findAllByRole('button', { name: '加入' });
    fireEvent.click(addButtons[0]);
    await waitFor(async () => expect(await db.listings.count()).toBe(1));
    await waitFor(async () => expect(await db.inbox.count()).toBe(1));
    fireEvent.click((await screen.findAllByRole('button', { name: '略過' }))[0]);
    await waitFor(async () => expect(await db.inbox.count()).toBe(0));
  });
  it('preview fields are read-only; 編輯 hands the item to the share screen', async () => {
    sessionStorage.clear();
    await addInbox({ text: '大安區套房 14000 可養貓' });
    render(<InboxScreen query={new URLSearchParams()} />);
    await screen.findByText('NT$14,000');
    // no live inputs in the inbox — a keystroke there would be eaten by the navigation
    expect(screen.queryByRole('spinbutton', { name: '租金' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: '房型' })).toBeNull();
    expect(screen.getByLabelText('房型').textContent).toBe('套房');

    fireEvent.click(screen.getByRole('button', { name: '編輯' }));
    await waitFor(async () => expect(await db.inbox.count()).toBe(0));
    expect(location.hash).toBe('#/share');
    expect(sessionStorage.getItem('trsat:share')).toContain('大安區套房');
  });
  it('opens paste sheet when ?paste=1', async () => {
    render(<InboxScreen query={new URLSearchParams('paste=1')} />);
    expect(await screen.findByRole('dialog', { name: '貼上房源' })).toBeTruthy();
  });
});
