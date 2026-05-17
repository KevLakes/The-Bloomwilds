#!/usr/bin/env node
/**
 * Generate PWA icons from scripts/icon-source.svg.
 * Run once whenever the icon design changes:
 *   node scripts/gen-icons.mjs
 */
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const source = resolve(root, 'scripts/icon-source.svg');
const outDir = resolve(root, 'public/art/ui');

const targets = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'icon-32.png' },
];

const svg = await readFile(source);

for (const { size, name } of targets) {
  const buf = await sharp(svg, { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await writeFile(resolve(outDir, name), buf);
  console.log(`✓ ${name} (${size}x${size})`);
}

// Also drop a copy of the source SVG as the favicon
await copyFile(source, resolve(root, 'public/favicon.svg'));
console.log('✓ public/favicon.svg');
