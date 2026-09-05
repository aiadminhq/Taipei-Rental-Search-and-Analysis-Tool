import type { Source } from './schema';

export interface SourceRef { source: Source; sourceId: string; canonicalUrl: string }

export function hashId(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export function extractFirstUrl(text: string): string | null {
  const m = text.match(/https?:\/\/[^\s<>"')\]]+/);
  if (!m) return null;
  return m[0].replace(/[.,;!?，。]+$/, '');
}

export function parseSourceUrl(raw: string): SourceRef | null {
  let u: URL;
  try { u = new URL(raw.trim()); } catch { return null; }
  const host = u.hostname.replace(/^(www|m|mobile|web)\./, '');
  const path = u.pathname;

  if (host.endsWith('591.com.tw')) {
    const m = path.match(/(\d{6,9})/);
    if (m) return { source: '591', sourceId: m[1], canonicalUrl: `https://rent.591.com.tw/${m[1]}` };
    return { source: '591', sourceId: hashId(raw), canonicalUrl: raw };
  }

  if (host === 'threads.net' || host === 'threads.com') {
    const m = path.match(/^\/(@[^/]+)\/post\/([A-Za-z0-9_-]+)/);
    if (m) return { source: 'threads', sourceId: m[2], canonicalUrl: `https://www.threads.com/${m[1]}/post/${m[2]}` };
    return { source: 'threads', sourceId: hashId(raw), canonicalUrl: raw };
  }

  if (host === 'facebook.com' || host === 'fb.com') {
    const mk = path.match(/^\/marketplace\/item\/(\d+)/);
    if (mk) return { source: 'fb_marketplace', sourceId: mk[1], canonicalUrl: `https://www.facebook.com/marketplace/item/${mk[1]}/` };
    const mg = path.match(/^\/groups\/([^/]+)\/(?:permalink|posts)\/(\d+)/);
    if (mg) return { source: 'fb_group', sourceId: `${mg[1]}:${mg[2]}`, canonicalUrl: `https://www.facebook.com/groups/${mg[1]}/posts/${mg[2]}/` };
    const fbid = u.searchParams.get('story_fbid') ?? u.searchParams.get('fbid');
    if (fbid) return { source: 'fb_group', sourceId: fbid, canonicalUrl: raw };
    return { source: 'fb_group', sourceId: hashId(raw), canonicalUrl: raw };
  }

  if (host === 'ptt.cc') {
    const m = path.match(/^\/bbs\/[A-Za-z_-]+\/(M\.\d+\.A\.[0-9A-Fa-f]{3})\.html/);
    if (m) return { source: 'ptt', sourceId: m[1], canonicalUrl: `https://www.ptt.cc${path}` };
  }

  return { source: 'other', sourceId: hashId(raw), canonicalUrl: raw };
}
