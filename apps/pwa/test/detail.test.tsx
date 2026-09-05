import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { parseInput, toListing } from '@trsat/core';
import { DetailScreen } from '../src/screens/Detail';
import { clearAll, db, upsertListing } from '../src/db';

const now = '2026-09-05T00:00:00.000Z';
beforeEach(async () => { await clearAll(); });

describe('DetailScreen', () => {
  it('shows facts, checklist, and changes status', async () => {
    const l = await upsertListing(toListing(parseInput({ text: '大安區套房 14000 可養貓 捷運古亭站 步行5分 0912345678' }), now, 'shortlist'));
    render(<DetailScreen id={l.id} />);
    await screen.findByText('NT$14,000');
    expect(screen.getByRole('list', { name: '條件檢核' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '已聯絡' }));
    await waitFor(async () => expect((await db.listings.get(l.id))?.status).toBe('contacted'));
  });
  it('inline edit of a missing field patches the listing', async () => {
    const l = await upsertListing(toListing(parseInput({ url: 'https://rent.591.com.tw/18234567' }), now, 'shortlist'));
    render(<DetailScreen id={l.id} />);
    fireEvent.click(await screen.findByRole('button', { name: '編輯' }));
    fireEvent.input(screen.getByLabelText('租金'), { target: { value: '13000' } });
    fireEvent.click(screen.getByRole('button', { name: '儲存' }));
    await waitFor(async () => expect((await db.listings.get(l.id))?.rent).toBe(13000));
  });
  it('renders not-found for unknown id', async () => {
    render(<DetailScreen id="nope" />);
    expect(await screen.findByText(/找不到房源/)).toBeTruthy();
  });
});
