#!/usr/bin/env node
/**
 * Favicons depuis le logo de la nav (public/images/brand/logo-mark.svg) : favicon.svg (copie),
 * favicon.ico (PNG 32 et 48 encapsulés), webclip.png (180, Apple), icon-512.png. Rendu par Chrome local.
 * Usage : node scripts/build-favicons.mjs
 */
import puppeteer from 'puppeteer-core';
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';

const SVG = 'public/images/brand/logo-mark.svg';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const svg = readFileSync(SVG, 'utf8');

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
async function png(size) {
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg style="display:block;width:${size}px;height:${size}px" `)}</body></html>`);
  return page.screenshot({ type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}
const sizes = { 32: await png(32), 48: await png(48), 180: await png(180), 512: await png(512) };
await browser.close();

/* ICO : en-tête + une entrée par image, chaque image en PNG (supporté depuis Windows Vista). */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
  let offset = 6 + 16 * entries.length;
  const dirs = [], blobs = [];
  for (const [size, data] of entries) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(size === 256 ? 0 : size, 0); dir.writeUInt8(size === 256 ? 0 : size, 1);
    dir.writeUInt8(0, 2); dir.writeUInt8(0, 3); dir.writeUInt16LE(1, 4); dir.writeUInt16LE(32, 6);
    dir.writeUInt32LE(data.length, 8); dir.writeUInt32LE(offset, 12);
    dirs.push(dir); blobs.push(data); offset += data.length;
  }
  return Buffer.concat([header, ...dirs, ...blobs]);
}
writeFileSync('public/favicon.ico', ico([[32, sizes[32]], [48, sizes[48]]]));
writeFileSync('public/webclip.png', sizes[180]);
writeFileSync('public/icon-512.png', sizes[512]);
copyFileSync(SVG, 'public/favicon.svg');
console.log('✓ favicon.svg, favicon.ico (32+48), webclip.png (180), icon-512.png');
