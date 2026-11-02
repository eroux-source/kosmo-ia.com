#!/usr/bin/env node
/**
 * Captures desktop (1440) + mobile (390) de chaque page, avec rapport de débordements,
 * erreurs console et requêtes en échec. Utilise le Chrome installé (pas de téléchargement).
 *
 * Usage : node scripts/screenshots.mjs <dossier-sortie> [/page1 /page2 …]
 *   BASE_URL=http://localhost:4321 par défaut.
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [, , outDir = 'docs/screenshots/latest', ...pages] = process.argv;
const PAGES = pages.length ? pages : ['/3dooh'];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const report = [];

for (const path of PAGES) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    const errors = [];
    const failed = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('requestfailed', (req) => failed.push(`${req.url()} (${req.failure()?.errorText})`));
    page.on('response', (res) => res.status() >= 400 && failed.push(`${res.url()} → ${res.status()}`));
    await page.setViewport(vp);
    // Les animations d'entrée sont désactivées (reduced motion) pour capturer l'état final.
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    try {
      await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch (error) {
      report.push({ path, viewport: vp.name, error: String(error) });
      await page.close();
      continue;
    }
    // Défilement progressif pour déclencher les chargements différés.
    const scroll = () => page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    // Une navigation (rechargement HMR, hash) peut interrompre une évaluation : on réessaie une fois.
    const retry = async (fn) => {
      try {
        return await fn();
      } catch (error) {
        report.push({ path, viewport: vp.name, note: `retry: ${String(error).slice(0, 80)} → ${page.url()}` });
        await new Promise((r) => setTimeout(r, 2000));
        return fn();
      }
    };
    await retry(scroll);
    const metrics = await retry(() => page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      const overflowing = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > width + 1 || r.left < -1) && !el.closest('.swiper, [data-ticker], .overflow-auto, [data-compare]');
        })
        .slice(0, 12)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 3).join('.')} → ${Math.round(el.getBoundingClientRect().right)}px`);
      const demo = document.querySelectorAll('[data-demo]').length;
      const placeholders = document.querySelectorAll('[data-placeholder]').length;
      return { scrollWidth: document.documentElement.scrollWidth, clientWidth: width, height: document.body.scrollHeight, overflowing, demo, placeholders, title: document.title };
    }));
    const file = join(outDir, `${path.replace(/^\//, '').replace(/[\/?=&]+/g, '_') || 'index'}--${vp.name}.png`);
    const shot = async (options) => {
      try {
        await page.screenshot(options);
      } catch (error) {
        report.push({ path, viewport: vp.name, note: `screenshot failed (${options.clip ? 'slice' : 'full'}): ${String(error).slice(0, 120)}` });
      }
    };
    await shot({ path: file, fullPage: true });
    // Captures lisibles par tranches de 3 hauteurs d'écran (--part-1, --part-2…) pour la revue visuelle.
    const slice = vp.height * 3;
    for (let y = 0, i = 1; y < metrics.height; y += slice, i++) {
      await shot({ path: file.replace(/\.png$/, `--part-${i}.png`), clip: { x: 0, y, width: vp.width, height: Math.min(slice, metrics.height - y) } });
    }
    report.push({ path, viewport: vp.name, file, ...metrics, horizontalOverflow: metrics.scrollWidth > metrics.clientWidth, consoleErrors: errors.slice(0, 5), failedRequests: [...new Set(failed)].slice(0, 8) });
    await page.close();
  }
}
await browser.close();

writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2));
for (const r of report) {
  if (r.note) {
    console.log(`ℹ  ${r.path} [${r.viewport}] ${r.note}`);
    continue;
  }
  const flag = r.error ? '✗ ERREUR' : r.horizontalOverflow ? '⚠ débordement' : '✓';
  console.log(`${flag}  ${r.path} [${r.viewport}] ${r.error ?? `${r.clientWidth}×${r.height}px · démo:${r.demo} · placeholders:${r.placeholders}`}`);
  if (r.overflowing?.length) console.log('     déborde :', r.overflowing.join(' | '));
  if (r.consoleErrors?.length) console.log('     console :', r.consoleErrors.join(' | '));
  if (r.failedRequests?.length) console.log('     requêtes :', r.failedRequests.join(' | '));
}
