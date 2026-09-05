import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
mkdirSync('public/icons', { recursive: true });
const svg = 'public/icons/icon.svg';
await sharp(svg).resize(192, 192).png().toFile('public/icons/icon-192.png');
await sharp(svg).resize(512, 512).png().toFile('public/icons/icon-512.png');
// maskable: 80% safe zone on solid theme colour
const inner = await sharp(svg).resize(410, 410).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#3b82f6' } })
  .composite([{ input: inner, gravity: 'centre' }]).png().toFile('public/icons/icon-maskable-512.png');
console.log('icons written');
