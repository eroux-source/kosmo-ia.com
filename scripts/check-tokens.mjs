#!/usr/bin/env node
/**
 * Garde-fou CLAUDE.md : aucune valeur de style en dur hors des fichiers de tokens.
 * Usage : npm run check:tokens
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname;
const ALLOWED = new Set(['src/styles/tokens.css', 'src/scripts/motion-tokens.ts']);
const EXT = /\.(astro|ts|css|mjs)$/;

const rules = [
  { name: 'couleur hexadécimale', re: /(?<![\w&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})\b/gi },
  { name: 'fonction couleur', re: /\b(?:rgba?|hsla?|oklch|color-mix)\(/g },
  // Un accès indexé JS (`obj['showreel-30s']`) commence par une quote : ce n'est pas une classe.
  { name: 'valeur Tailwind arbitraire', re: /[\w:-]\[(?!['"])(?![^\]]*var\()[^\]]*\d(?:px|rem|em|%|vh|vw|ms|s)\b[^\]]*\]/g },
  { name: 'palette Tailwind hors charte', re: /\b(?:bg|text|border|from|to|via|fill|stroke|ring|outline)-(?:slate|gray|zinc|neutral|stone|red|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g },
  { name: 'style inline', re: /\bstyle=["{]/g },
  { name: 'unité brute en CSS', re: /:\s*[^;{}]*\b\d*\.?\d+(?:px|rem|em|vh|vw)\b/g, css: true },
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (EXT.test(entry)) files.push(path);
  }
  return files;
}

let errors = 0;
for (const file of walk(join(ROOT, 'src'))) {
  const rel = relative(ROOT, file);
  if (ALLOWED.has(rel)) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const code = line.replace(/\/\/.*$|\/\*.*?\*\//g, '');
    for (const rule of rules) {
      if (rule.css && !file.endsWith('.css')) continue;
      for (const match of code.matchAll(rule.re)) {
        errors++;
        console.error(`${rel}:${i + 1}  ${rule.name} → ${match[0].trim()}`);
      }
    }
  });
}

if (errors) {
  console.error(`\n✗ ${errors} valeur(s) en dur. Ajoute un token dans src/styles/tokens.css (ou motion-tokens.ts).`);
  process.exit(1);
}
console.log('✓ Aucune valeur en dur hors des fichiers de tokens.');
