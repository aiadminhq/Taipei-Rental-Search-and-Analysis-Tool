import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { readSharePayload, stashShare, takeShare } from '../src/lib/share';
import { ShareScreen } from '../src/screens/Share';
import { db, clearAll } from '../src/db';

beforeEach(async () => { await clearAll(); sessionStorage.clear(); location.hash = ''; });

describe('readSharePayload', () => {
  it('returns null without share params', () => { expect(readSharePayload('')).toBeNull(); });
  it('pulls url out of text (Android puts the link in text)', () => {
    const p = readSharePayload('?text=' + encodeURIComponent('大安套房 https://rent.591.com.tw/18234567'));
    expect(p?.url).toBe('https://rent.591.com.tw/18234567');
  });
  it('stash/take is one-shot', () => {
    stashShare({ text: 'x' });
    expect(takeShare()).toEqual({ text: 'x' });
    expect(takeShare()).toBeNull();
  });
});

describe('ShareScreen', () => {
  const text = '大安區獨立套房\n租金 14,500/月\n變頻冷氣 冰箱 洗衣機 對外窗\n可養貓 捷運科技大樓站 步行6分';
  it('shows parsed preview and tier, and 加入 writes a shortlist listing', async () => {
    stashShare({ text });
    render(<ShareScreen />);
    await screen.findByText('NT$14,500');
    expect(screen.getByText('符合')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '加入房源' }));
    await waitFor(async () => expect(await db.listings.count()).toBe(1));
    const l = (await db.listings.toArray())[0];
    expect(l.status).toBe('shortlist'); expect(l.rent).toBe(14500);
    expect(location.hash).toBe('#/');
  });
  it('先放收件匣 stores the raw payload', async () => {
    stashShare({ text: '中和雅房 8000' });
    render(<ShareScreen />);
    fireEvent.click(await screen.findByRole('button', { name: '先放收件匣' }));
    await waitFor(async () => expect(await db.inbox.count()).toBe(1));
    expect(location.hash).toBe('#/inbox');
  });
  it('low confidence disables 加入 until user confirms a field', async () => {
    stashShare({ url: 'https://rent.591.com.tw/18234567' });
    render(<ShareScreen />);
    const add = await screen.findByRole('button', { name: '加入房源' });
    expect((add as HTMLButtonElement).disabled).toBe(true);
    fireEvent.input(screen.getByLabelText('租金'), { target: { value: '15000' } });
    await waitFor(() => expect((screen.getByRole('button', { name: '加入房源' }) as HTMLButtonElement).disabled).toBe(false));
  });
});
