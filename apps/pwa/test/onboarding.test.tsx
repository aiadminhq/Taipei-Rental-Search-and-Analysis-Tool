import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { App } from '../src/app';
import { clearAll } from '../src/db';
import { isOnboarded } from '../src/screens/Onboarding';

beforeEach(async () => { await clearAll(); location.hash = ''; sessionStorage.clear(); });

describe('Onboarding', () => {
  it('shows on first run and completes after three steps', async () => {
    render(<App />);
    expect(await screen.findByText(/安裝到主畫面/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    expect(await screen.findByText(/確認個人條件/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '下一步' }));
    expect(await screen.findByText(/試著分享一筆/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '開始使用' }));
    await waitFor(async () => expect(await isOnboarded()).toBe(true));
    expect(await screen.findByRole('heading', { name: '房源' })).toBeTruthy();
  });
});
