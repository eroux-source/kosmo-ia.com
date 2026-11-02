#!/usr/bin/env node
/**
 * Convertit les deux GIF du comparateur « the shift » (imports/shift/dooh.gif, imports/shift/3dooh.gif)
 * en MP4 muets (public/video/shift-<name>.mp4) et met à jour src/data/shift-videos.json.
 * Usage : node scripts/build-shift-videos.mjs
 */
import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';

const done = [];
for (const name of ['dooh', '3dooh']) {
  const input = ['gif', 'webp', 'mp4', 'mov'].map((ext) => `imports/shift/${name}.${ext}`).find(existsSync);
  if (!input) {
    console.log(`· ${name}: aucun fichier dans imports/shift/ (${name}.gif, .webp, .mp4 ou .mov)`);
    continue;
  }
  const out = `public/video/shift-${name}.mp4`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', input, '-an', '-movflags', '+faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-crf', '23', out], { stdio: 'inherit' });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', out, '-frames:v', '1', '-q:v', '3', `public/images/shift/${name}.webp`], { stdio: 'inherit' });
  done.push(name);
  console.log('✓', name, '→', out);
}
writeFileSync('src/data/shift-videos.json', JSON.stringify(done) + '\n');
