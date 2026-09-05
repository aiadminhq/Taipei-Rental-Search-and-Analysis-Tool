import type { Source, Status } from '@trsat/core';

export const formatRent = (n?: number) => (n === undefined ? '—' : `NT$${n.toLocaleString('zh-TW')}`);
export const formatArea = (n?: number) => (n === undefined ? '—' : `${n} 坪`);
export const SOURCE_LABEL: Record<Source, string> = { '591': '591', threads: 'Threads', fb_group: 'FB 社團', fb_marketplace: 'FB Marketplace', ptt: 'PTT', manual: '手動', other: '其他' };
export const sourceLabel = (s: Source) => SOURCE_LABEL[s];
export const STATUS_LABEL: Record<Status, string> = { inbox: '收件匣', shortlist: '候選', contacted: '已聯絡', viewing: '約看房', viewed: '已看房', rejected: '淘汰', signed: '已簽約' };
export const mapsUrl = (l: { address?: string; district?: string; city?: string; title: string }) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address ?? `${l.city ?? ''}${l.district ?? ''} ${l.title}`)}`;
