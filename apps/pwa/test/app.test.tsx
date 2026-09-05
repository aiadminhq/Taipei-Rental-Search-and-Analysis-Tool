import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { App } from '../src/app';
import { clearAll } from '../src/db';
import { setOnboarded } from '../src/screens/Onboarding';

beforeEach(async () => { await clearAll(); await setOnboarded(); });

describe('App shell', () => {
  it('renders four tabs and defaults to 房源', async () => {
    location.hash = '';
    render(<App />);
    expect(await screen.findByRole('navigation', { name: '主要導覽' })).toBeTruthy();
    for (const label of ['收件匣', '房源', '比較', '設定']) expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: '房源' })).toBeTruthy();
  });
});
