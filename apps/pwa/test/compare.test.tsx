import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { parseInput, toListing } from '@trsat/core';
import { CompareScreen, diffClass } from '../src/screens/Compare';
import { clearAll, upsertListing, toggleCompare, getCompareIds } from '../src/db';

const now = '2026-09-05T00:00:00.000Z';
beforeEach(async () => { await clearAll(); });

describe('CompareScreen', () => {
  it('empty state', async () => {
    render(<CompareScreen />);
    expect(await screen.findByText(/尚未選擇/)).toBeTruthy();
  });
  it('renders columns and removes one', async () => {
    const a = await upsertListing(toListing(parseInput({ text: '大安區套房 14000 8坪' }), now, 'shortlist'));
    const b = await upsertListing(toListing(parseInput({ text: '信義區套房 16000 10坪' }), now, 'shortlist'));
    await toggleCompare(a.id); await toggleCompare(b.id);
    render(<CompareScreen />);
    await screen.findByText('NT$14,000'); expect(screen.getByText('NT$16,000')).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: '移除' })[0]);
    await waitFor(async () => expect(await getCompareIds()).toEqual([b.id]));
  });
  it('diffClass highlights differing rows', () => {
    expect(diffClass(['a', 'a'], 0)).toBe('');
    expect(diffClass(['a', 'b'], 1)).not.toBe('');
  });
});
