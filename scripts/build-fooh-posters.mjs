#!/usr/bin/env node
/**
 * Extrait une image de couverture de la vidéo principale de chaque projet FOOH (ffmpeg lit l'URL
 * directement, pas de téléchargement complet) → public/images/fooh/<slug>.jpg + src/data/fooh/posters.json.
 * Usage : node scripts/build-fooh-posters.mjs [slug…]   (sans argument : les projets sans poster)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const projects = JSON.parse(readFileSync('src/data/fooh/projects.json', 'utf8'));
const only = process.argv.slice(2);
const done = [];
for (const p of projects) {
  const out = `public/images/fooh/${p.slug}.jpg`;
  if (only.length ? !only.includes(p.slug) : existsSync(out)) {
    if (existsSync(out)) done.push(p.slug);
    continue;
  }
  try {
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '1.5', '-i', p.media.mainVideo, '-frames:v', '1', '-vf', 'scale=720:-2', '-q:v', '3', out], { stdio: 'inherit', timeout: 120000 });
    done.push(p.slug);
    console.log('✓', p.slug);
  } catch (e) {
    console.error('✗', p.slug, e.message.split('\n')[0]);
  }
}
writeFileSync('src/data/fooh/posters.json', JSON.stringify(done.sort(), null, 2) + '\n');
console.log(`${done.length}/${projects.length} posters`);
