import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { DEFAULT_PROFILE, parseInput, toListing } from '@trsat/core';
import { ListingsScreen } from '../src/screens/Listings';
import { clearAll, saveProfile, upsertListing } from '../src/db';

const now = '2026-09-05T00:00:00.000Z';
beforeEach(async () => { await clearAll(); location.hash = ''; });

describe('ListingsScreen', () => {
  it('renders cards, collapses 不符, navigates on click', async () => {
    await upsertListing(toListing(parseInput({ text: '大安區套房 14000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行5分' }), now, 'shortlist'));
    await upsertListing(toListing(parseInput({ text: '信義區套房 30000' }), now, 'shortlist'));
    render(<ListingsScreen />);
    await screen.findByText('NT$14,000');
    expect(screen.queryByText('NT$30,000')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /不符 \(1\)/ }));
    expect(await screen.findByText('NT$30,000')).toBeTruthy();
    fireEvent.click(screen.getByText('NT$14,000'));
    expect(location.hash).toMatch(/^#\/l\/manual(?::|%3A)/);   // navigate() encodes the id
  });
  it('缺X tags follow the saved profile, not the built-in defaults', async () => {
    const post = '大安區套房 14000 可養貓 捷運古亭站 步行5分';   // no equipment detected → 缺X tags show
    await upsertListing(toListing(parseInput({ text: post }), now, 'shortlist'));
    const { unmount } = render(<ListingsScreen />);
    expect(await screen.findByText('缺變頻冷氣')).toBeTruthy();
    unmount();

    await saveProfile({ ...DEFAULT_PROFILE, mustHave: ['電梯', '網路'] });
    render(<ListingsScreen />);
    expect(await screen.findByText('缺電梯')).toBeTruthy();
    expect(screen.getByText('缺網路')).toBeTruthy();
    expect(screen.queryByText('缺變頻冷氣')).toBeNull();
  });
  it('shows empty state', async () => {
    render(<ListingsScreen />);
    expect(await screen.findByText(/還沒有房源/)).toBeTruthy();
  });
});
