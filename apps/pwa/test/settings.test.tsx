import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { SettingsScreen } from '../src/screens/Settings';
import { splitTags } from '../src/lib/file';
import { clearAll, getProfile, upsertListing, db } from '../src/db';
import { parseInput, toListing } from '@trsat/core';

beforeEach(async () => { await clearAll(); });

describe('splitTags', () => {
  it('splits on commas, fullwidth commas, whitespace', () => {
    expect(splitTags('變頻冷氣, 冰箱，洗衣機\n對外窗 ')).toEqual(['變頻冷氣', '冰箱', '洗衣機', '對外窗']);
  });
});

describe('SettingsScreen', () => {
  it('edits and saves profile, recomputing rules', async () => {
    const l = await upsertListing(toListing(parseInput({ text: '大安區套房 14000 變頻冷氣 冰箱 洗衣機 對外窗 可養貓 捷運古亭站 步行5分' }), '2026-09-05T00:00:00.000Z', 'shortlist'));
    render(<SettingsScreen />);
    const input = await screen.findByLabelText('套房預算上限');
    fireEvent.input(input, { target: { value: '12000' } });
    fireEvent.click(screen.getByRole('button', { name: '儲存條件' }));
    await waitFor(async () => expect((await getProfile()).budget.套房).toBe(12000));
    await waitFor(async () => expect((await db.listings.get(l.id))?.rule?.tier).toBe('fail'));
  });
  it('clear all requires two confirmations', async () => {
    await upsertListing(toListing(parseInput({ text: '大安區套房 14000' }), '2026-09-05T00:00:00.000Z'));
    vi.stubGlobal('confirm', vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false));
    render(<SettingsScreen />);
    fireEvent.click(await screen.findByRole('button', { name: '清除所有資料' }));
    await new Promise((r) => setTimeout(r, 20));
    expect(await db.listings.count()).toBe(1);
    vi.unstubAllGlobals();
  });
});
