#!/usr/bin/env node
/**
 * Génère public/downloads/3dooh-media-owner-checklist.pdf à partir de src/data/checklist.json.
 * Couleurs lues dans src/styles/tokens.css ; police Helvetica (police système de pdfkit) en attendant
 * les TTF de la charte (décision « checklist-pdf »).
 */
import PDFDocument from 'pdfkit';
import { createWriteStream, mkdirSync, readFileSync } from 'node:fs';

const checklist = JSON.parse(readFileSync(new URL('../src/data/checklist.json', import.meta.url), 'utf8'));
const tokens = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const token = (name) => tokens.match(new RegExp(`--${name}:\\s*([^;]+);`))[1].trim();
const ACID = token('kosmo-acid');
const BLACK = token('kosmo-black');
const GREY = token('grey-400');

mkdirSync(new URL('../public/downloads/', import.meta.url), { recursive: true });
const out = new URL('../public/downloads/3dooh-media-owner-checklist.pdf', import.meta.url);
const doc = new PDFDocument({ size: 'A4', margin: 56, info: { Title: checklist.title, Author: 'KOSMO®' } });
doc.pipe(createWriteStream(out));

// Couverture
doc.rect(0, 0, doc.page.width, doc.page.height).fill(BLACK);
doc.fillColor(ACID).font('Helvetica-Bold').fontSize(11).text('KOSMO®  ·  3DOOH', 56, 56, { characterSpacing: 1 });
doc.fillColor('white').fontSize(34).text(checklist.title.toUpperCase(), 56, 200, { width: 460, lineGap: 4 });
doc.fillColor(GREY).font('Helvetica').fontSize(13).text(checklist.subtitle, 56, 340, { width: 420, lineGap: 3 });
doc.fillColor(ACID).fontSize(10).text(checklist.demo ? 'DEMO VERSION — content to be validated' : '', 56, doc.page.height - 90);
doc.fillColor('white').fontSize(10).text('contact@kosmocgi.com  ·  kosmocgi.com/3dooh', 56, doc.page.height - 72);

// Pages
doc.addPage();
doc.fillColor(BLACK).font('Helvetica').fontSize(11).text(checklist.intro, { width: 480, lineGap: 3 });
doc.moveDown(1.5);
checklist.sections.forEach((section, i) => {
  if (doc.y > doc.page.height - 160) doc.addPage();
  doc.fillColor(ACID).font('Helvetica-Bold').fontSize(9).text(`0${i + 1}`, { characterSpacing: 1 });
  doc.fillColor(BLACK).fontSize(16).text(section.title.toUpperCase(), { lineGap: 2 });
  doc.moveDown(0.4);
  section.items.forEach((item) => {
    const y = doc.y;
    doc.rect(56, y + 3, 9, 9).lineWidth(1).stroke(GREY);
    doc.fillColor(BLACK).font('Helvetica').fontSize(11).text(item, 74, y, { width: 440 });
    doc.moveDown(0.35);
  });
  doc.moveDown(1);
});
doc.moveDown(1);
doc.fillColor(BLACK).font('Helvetica-Bold').fontSize(12).text(checklist.closing, { width: 460 });
doc.moveDown(0.5);
doc.fillColor(GREY).font('Helvetica').fontSize(10).text('Questions about your screen? kosmocgi.com/contact  ·  Free 3D concept: kosmocgi.com/3dooh#offer');
doc.end();
console.log('✓ PDF written:', out.pathname);
