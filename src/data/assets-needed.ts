/**
 * Visuels et médias manquants. Chaque <Placeholder id="…"> pointe ici ; /todo liste tout.
 * `where` = le fichier où brancher le vrai fichier une fois fourni.
 */
export interface AssetNeeded {
  what: string;
  where: string;
  format?: string;
}

export const assetsNeeded = {
  'media-owner-logos': {
    what: 'Logos officiels des régies listées par marché mais pas encore affichées (pas de SVG récupéré) : Mediatransports, Extime JCDecaux Airport, Phenix Groupe, APG|SGA, Goldbach Neo, Publifer, Media Frankfurt, awk AUSSENWERBUNG, Gewista, EPAMEDIA, Branded Cities, Sherwood Outdoor, Al Arabia, Arabian Outdoor, Faden Media.',
    where: 'public/images/partners/<slug>.svg, puis `logo: { src, width }` dans src/data/3dooh.ts → mediaOwners',
    format: 'SVG officiel, passé en noir',
  },
  'brand-logos': {
    what: 'Logos officiels des marques des témoignages (Netflix, Uber, Lego, et les autres de la liste) : affichés en lettres tant que les fichiers ne sont pas déposés.',
    where: 'src/assets/logos/brands/<slug>.svg (netflix.svg, miele.svg, uber.svg, pringles.svg, zalando.svg, lego.svg)',
    format: 'SVG monochrome (fill currentColor), hauteur libre',
  },
  'hero-3dooh-video': {
    what: 'Vidéo 3DOOH réelle pour le fond du hero (aujourd’hui : vidéo New York de la référence, cadrée 9:16).',
    where: 'src/data/3dooh.ts → hero.video',
    format: 'MP4 16:9, 1920×1080, ≤ 8 Mo, muet, 10–20 s en boucle',
  },
  'og-image': {
    what: 'Image de partage (OG) avec le logo : aujourd’hui un recadrage du visuel dino de la référence.',
    where: 'public/og/default.jpg',
    format: 'JPG 1200×630',
  },
  'before-after-videos': {
    what: 'Les deux GIF animés du comparateur (film plat DOOH / version 3DOOH, fournis le 27/09 mais reçus en images fixes) : à déposer pour passer en vidéos synchronisées.',
    where: 'imports/shift/dooh.gif et imports/shift/3dooh.gif, puis `node scripts/build-shift-videos.mjs`',
    format: 'GIF, WEBP animé, MP4 ou MOV 16:9, même durée',
  },
  'process-briefing': { what: 'Capture réelle de l’étape Briefing (audit de plan média, mapping écrans).', where: 'src/data/3dooh.ts → process.steps[0].image', format: 'JPG/AVIF 4:3' },
  'process-creative-strategy': { what: 'Capture réelle de l’étape Creative strategy (moodboard, concept).', where: 'src/data/3dooh.ts → process.steps[1].image', format: 'JPG/AVIF 4:3' },
  'process-production': { what: 'Capture réelle de l’étape Production (wireframe → rendu final).', where: 'src/data/3dooh.ts → process.steps[2].image', format: 'JPG/AVIF 4:3' },
  'process-media-activation': { what: 'Capture réelle de l’étape Media activation (pixel maps, resizes par écran).', where: 'src/data/3dooh.ts → process.steps[3].image', format: 'JPG/AVIF 4:3' },
  'process-amplification': { what: 'Capture réelle de l’étape Amplification (cutdowns sociaux).', where: 'src/data/3dooh.ts → process.steps[4].image', format: 'JPG/AVIF 4:3' },
  'case-making-of': { what: 'Making-of d’un cas : wireframe, calage de perspective, test sur écran.', where: 'src/content/cases/*.md → videos.makingOf / gallery', format: 'MP4 ou 3–5 images' },
  'case-social-video': { what: 'Version sociale (FOOH) du cas.', where: 'src/content/cases/*.md → videos.social', format: 'MP4 9:16' },
  'client-logo': { what: 'Logo du client du cas (mono).', where: 'src/content/cases/*.md → clientLogo', format: 'SVG mono' },
  'testimonial-photo': { what: 'Photo du témoin (ou vidéo de 30 s).', where: 'src/data/testimonials.ts', format: 'JPG carré 400×400' },
  'founder-video': { what: 'Vidéo de 60–90 s face caméra : qui est KOSMO®, pourquoi le 3DOOH.', where: 'src/data/3dooh.ts → founder', format: 'MP4 16:9 ou 9:16' },
  'city-hero': { what: 'Photo ou vidéo d’un écran 3DOOH dans la ville.', where: 'src/data/cities.ts → hero', format: 'JPG/MP4 16:9' },
  'journal-cover': { what: 'Visuel de couverture de l’article.', where: 'src/content/posts/*.md → cover', format: 'JPG 16:9' },
  'team-photo': { what: 'Photo du membre de l’équipe (style dither de la référence).', where: 'src/data/team.ts', format: 'PNG 4:5' },
  'partner-case': { what: 'Exemple de projet livré en marque blanche (anonymisé).', where: 'src/data/partners.ts', format: 'MP4 9:16 ou JPG' },
  'checklist-pdf-cover': { what: 'Couverture de la checklist PDF (aujourd’hui générée sans visuel).', where: 'scripts/build-checklist-pdf.mjs', format: 'JPG A4' },
  'play-example-snacking': { what: 'KOSMO® PLAY : visuel du premier cas (le jeu en situation, sur mobile ou sur le pack). Gabarit fictif « marque de snacking » en attendant les vrais cas.', where: 'src/data/play.ts → examples.items[0].visual', format: 'JPG ou MP4 4:5' },
  'play-example-sport': { what: 'KOSMO® PLAY : visuel du deuxième cas. Gabarit fictif « enseigne de sport ».', where: 'src/data/play.ts → examples.items[1].visual', format: 'JPG ou MP4 4:5' },
  'play-example-beauty': { what: 'KOSMO® PLAY : visuel du troisième cas. Gabarit fictif « marque de beauté ».', where: 'src/data/play.ts → examples.items[2].visual', format: 'JPG ou MP4 4:5' },
} satisfies Record<string, AssetNeeded>;

export type AssetId = keyof typeof assetsNeeded;
