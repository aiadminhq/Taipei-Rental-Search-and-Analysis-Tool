import { extractFirstUrl } from '@trsat/core';

export interface SharePayload { title?: string; text?: string; url?: string }
const KEY = 'trsat:share';

export function readSharePayload(search: string): SharePayload | null {
  const q = new URLSearchParams(search);
  const title = q.get('title') ?? undefined;
  const text = q.get('text') ?? undefined;
  let url = q.get('url') ?? undefined;
  if (!title && !text && !url) return null;
  if (!url && text) url = extractFirstUrl(text) ?? undefined;
  if (!url && title) url = extractFirstUrl(title) ?? undefined;
  return { title, text, url };
}

export function stashShare(p: SharePayload): void { sessionStorage.setItem(KEY, JSON.stringify(p)); }
export function takeShare(): SharePayload | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  sessionStorage.removeItem(KEY);
  try { return JSON.parse(raw) as SharePayload; } catch { return null; }
}
