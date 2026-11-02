#!/usr/bin/env node
/**
 * Génère le CSV d'import en masse Pinterest (épingles vidéo) pour tous les projets FOOH.
 * Format : https://help.pinterest.com/fr/business/article/bulk-upload-video-pins
 *   Title (≤ 100) · Media URL (lien public direct .mp4) · Pinterest board · Thumbnail (URL image, même ratio)
 *   Description (≤ 500) · Link · Publish date (UTC, AAAA-MM-JJTHH:MM:SS) · Keywords (liste séparée par des virgules)
 *
 * Sortie : docs/pinterest/fooh-video-pins.csv (200 lignes max par import Pinterest, on en a 63).
 * Usage : node scripts/build-pinterest-fooh.mjs [--start=2026-09-29] [--no-schedule] [--check]
 *   --start        premier jour de publication (défaut : demain), 2 épingles par jour à 09:00 et 16:00 UTC
 *   --no-schedule  colonne « Publish date » vide → publication immédiate à l'import
 *   --check        vérifie en HTTP (HEAD) que chaque vidéo, vignette et lien répond
 *
 * Les textes (titre, description, mots-clés) sont rédigés ici à partir de src/data/fooh/projects.json :
 * rien d'inventé, les chiffres viennent de `metrics`, les citations internes ne sont jamais utilisées.
 * Les projets `restrictedClient` (marques à ne pas citer sans accord) sont placés en fin de fichier.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const SITE = 'https://www.kosmocgi.com';
const UTM = 'utm_source=pinterest&utm_medium=social&utm_campaign=fooh-pins';
const OUT = 'docs/pinterest/fooh-video-pins.csv';
const TITLE_MAX = 100;
const DESC_MAX = 500;

const args = process.argv.slice(2);
const opt = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const flag = (name) => args.includes(`--${name}`);

const projects = JSON.parse(readFileSync('src/data/fooh/projects.json', 'utf8'));

/** Tableaux Pinterest par secteur (créés automatiquement à l'import s'ils n'existent pas). */
const BOARDS = {
  Fashion: 'FOOH Fashion & Beauty Campaigns',
  Beauty: 'FOOH Fashion & Beauty Campaigns',
  Entertainment: 'FOOH Entertainment & Gaming Campaigns',
  Sports: 'FOOH Sports Campaigns',
  Betting: 'FOOH Sports Campaigns',
  'Retail / Home': 'FOOH Retail & Food Campaigns',
  'Food & Beverage': 'FOOH Retail & Food Campaigns',
  Tech: 'FOOH Tech & Product Launches',
  Automotive: 'FOOH Tech & Product Launches',
  'Home appliances': 'FOOH Tech & Product Launches',
  'Real Estate': 'FOOH B2B, Real Estate & Events',
  'Insurance / Finance': 'FOOH B2B, Real Estate & Events',
  HR: 'FOOH B2B, Real Estate & Events',
  'Events / Agencies': 'FOOH B2B, Real Estate & Events',
};
/** Corrections de tableau quand le secteur du fichier ne colle pas au produit. */
const BOARD_OVERRIDES = { extreme: 'FOOH Retail & Food Campaigns' };

/** Vidéos servies par le site à la place du fichier Framer (.mov refusé par Pinterest, converti en MP4 720p). */
const MEDIA_OVERRIDES = {
  icade: '/video/fooh/icade.mp4',
  'heavent-i': '/video/fooh/heavent-i.mp4',
};

const BASE_KEYWORDS = ['FOOH', 'fake out of home', 'CGI advertising', 'mixed reality ad', '3D advertising', 'viral marketing video'];

/** Textes par projet : title ≤ 100, description ≤ 500, keywords spécifiques (les mots-clés de base et la ville sont ajoutés). */
const COPY = {
  'zalando-lounge-balance': {
    title: "Zalando Lounge FOOH: a whole season's finds balanced on a Paris bench",
    description:
      "FOOH film for Zalando Lounge's seasonal campaign. On a Paris bench, a model pours tea into a cup balanced on a vase, a glass, sneakers, a handbag, glasses, a red bag and a speaker: fashion, accessories and homeware in one impossible stack, on a real street, no cut. Real shoot plus CGI, close to a million views. FOOH (fake out of home) and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['fashion marketing', 'Zalando', 'e-commerce campaign', 'viral fashion ad', 'autumn collection'],
  },
  'avatar-earth-kingdom-public-works': {
    title: 'Netflix Avatar: The Last Airbender FOOH, a Los Angeles sidewalk fixed by earthbenders',
    description:
      'Five days before season 2 of Avatar: The Last Airbender, a green stencil appeared on a cracked Los Angeles sidewalk: Earth Kingdom Public Works. The tag was real. Then the FOOH film: a foot steps on the crack, the concrete splits and the sidewalk opens onto the Earth Kingdom. Posted on the Netflix Avatar account, 30K+ likes, fans went looking for the tag. CGI street activation by KOSMO®, FOOH agency in Paris and Dubai.',
    keywords: ['Netflix marketing', 'TV series launch', 'guerrilla marketing', 'street activation', 'Avatar The Last Airbender'],
  },
  'miele-hydroclean': {
    title: 'Miele HydroClean FOOH: the oven that cleans itself, on a Paris facade',
    description:
      "Social version of Miele's HydroClean launch: the CGI building from the 81-screen DOOH campaign, placed in a real Paris street and filmed as if it were there. The oven door opens in the facade, the cleaning cycle runs, the oven ends spotless. Delivered in five languages and three social formats (9:16, 1:1, 2:3). FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['home appliances marketing', 'product launch video', 'Miele', 'DOOH campaign', 'kitchen appliances'],
  },
  'zalando-prive-tennis': {
    title: "Privé by Zalando FOOH: a giant tennis ball on the Fontaine de l'Observatoire, Paris",
    description:
      "For the Paris tennis season, Privé by Zalando's first event activation: a giant tennis ball on top of the Fontaine de l'Observatoire, a scoreboard in the brand's purple and a player serving from the edge of the basin. Strategy, concept, CGI production and seeding by KOSMO®. Part of a wider social campaign with vox pops, behind the scenes and five sponsored players. FOOH agency, Paris and Dubai.",
    keywords: ['tennis marketing', 'fashion campaign', 'Zalando', 'event activation', 'sports season'],
  },
  'super-mario-galaxy-yoshi-eggs': {
    title: 'Super Mario Galaxy Movie FOOH: a carton of Yoshi eggs in a New York grocery store',
    description:
      'Concept imagined by KOSMO® for the release of The Super Mario Galaxy Movie: a carton of Yoshi eggs, green spots and all, sitting in the egg aisle of a New York grocery store, filmed like someone who just found it. One product that never existed. 5 million views on its own, 15M earned media impressions, 500K engagements, zero paid media. The most common comment: "wish it was real". FOOH by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['movie marketing', 'Nintendo', 'fake product', 'viral CGI video', 'Super Mario'],
  },
  'big-mistakes-ii': {
    title: 'Big Mistakes FOOH (2/2): the Sunset Boulevard necklace heist, seen from the street',
    description:
      "Second film of the heist for Netflix's Big Mistakes: a passenger films the Sunset Boulevard billboard from a car, points, and the diamond necklace is already being dragged off the edge of the board. Same real billboard, same CGI necklace, a different witness. Two angles on one theft gave the launch two posts before the cast showed up wearing the necklace. FOOH by KOSMO®, CGI advertising agency, Paris and Dubai.",
    keywords: ['Netflix', 'billboard stunt', 'series launch', 'CGI billboard', 'Sunset Boulevard'],
  },
  'big-mistakes-i': {
    title: 'Big Mistakes FOOH (1/2): a thief steals the necklace off a Sunset Boulevard billboard',
    description:
      'On 10 March 2026 a billboard went up on Sunset Boulevard with no logo: a diamond necklace spelling 4.9.26. That night, this film appeared on the Big Mistakes account: security-camera footage of a thief climbing the structure and walking off with the necklace. The billboard is real, the theft is CGI, built on our own night footage and graded like a CCTV feed. First post of the Netflix series account. FOOH by KOSMO®, Paris and Dubai.',
    keywords: ['Netflix', 'CCTV style video', 'billboard hack', 'teaser campaign', 'Sunset Boulevard'],
  },
  'proman-ii': {
    title: 'Proman FOOH: a mixed reality film for the 2026 back-to-work recruitment campaign',
    description:
      'For its 2026 back-to-work campaign, Proman wanted a bold statement: position the recruitment group as an innovative, forward-thinking employer. Our answer is a mixed reality film shot in Paris that brings the brand into the street, its values and job opportunities in one visually striking sequence. Second FOOH film for Proman after the 2024 campaign. CGI and FOOH advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['recruitment marketing', 'employer branding', 'HR campaign', 'staffing agency', 'back to work'],
  },
  'maisons-du-monde-v': {
    title: 'Maisons du Monde FOOH: Christmas magic at the Duomo in Milan',
    description:
      "Fifth FOOH film for Maisons du Monde: the Christmas collection meets the Duomo in Milan. The brand's decorations take over the square in a CGI sequence built to look like a real festive moment in the heart of the city. 1M+ earned media impressions and 250K+ engagements. Fake out of home and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['Christmas campaign', 'home decor marketing', 'retail video', 'Maisons du Monde', 'Duomo'],
  },
  'france-tv': {
    title: 'France TV FOOH: dinosaurs walk into Paris for Sur la terre des dinosaures',
    description:
      'To launch its series Sur la terre des dinosaures, France TV wanted an activation people would share. Our mixed reality film brings the prehistoric world into the streets of Paris: realistic CGI dinosaurs in a real setting, filmed like a passer-by caught them. 25M+ earned media impressions. FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['TV series launch', 'dinosaurs', 'broadcaster marketing', 'France Télévisions', 'documentary series'],
  },
  'heavent-iii': {
    title: 'Heavent 2025 FOOH: the event industry show announced at the Centre Pompidou',
    description:
      'To announce the dates of Heavent, the key trade show of the live event industry, Weyou Group wanted buzz on social. Our mixed reality film sets the show at the Centre Pompidou in Paris, blending the energy of the event with CGI visuals on the iconic building. Third FOOH film for Heavent. Fake out of home advertising by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['trade show marketing', 'event industry', 'B2B video', 'Centre Pompidou', 'exhibition'],
  },
  'nrj-x-fini': {
    title: 'NRJ Music Awards x FINI FOOH: the candy brand lands in Cannes',
    description:
      "FINI wanted to promote its contest for the NRJ Music Awards during one of the most awaited music events of the year. Our mixed reality film virtually brings FINI to Cannes, mixing the energy of the awards with the brand's playful, colourful universe to drive contest entries. FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['candy brand marketing', 'music awards', 'contest campaign', 'FMCG', 'NRJ Music Awards'],
  },
  neoness: {
    title: 'Neoness FOOH: the back-to-school gym offer takes over Paris',
    description:
      "Neoness wanted to launch its back-to-school offer with a campaign that gets attention. Our mixed reality film brings the gym brand's vibrant universe into the streets of Paris, playful storytelling and CGI visuals to boost awareness and engagement at the start of the fitness season. FOOH (fake out of home) advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['gym marketing', 'fitness campaign', 'back to school', 'sports club', 'membership offer'],
  },
  keepcool: {
    title: 'Keepcool FOOH: a nationwide mixed reality film for the back-to-school gym offer',
    description:
      "Keepcool wanted its back-to-school offer to reach audiences across France. Our mixed reality film brings the brand's fun, energetic world to life on a national scale, playful CGI storytelling built to be shared. 1.5M+ earned media impressions and 10K+ engagements. FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['gym marketing', 'fitness campaign', 'France', 'membership offer', 'sports club'],
  },
  'apple-iphone-17-pro-max': {
    title: 'iPhone 17 Pro Max FOOH concept in Dubai: 46M+ views on TikTok and Instagram',
    description:
      "Concept imagined by KOSMO® around the iPhone 17 launch: a product-focused mixed reality film shot in Dubai that puts the phone's new features on a giant scale in the city. Not a commissioned Apple campaign, a demonstration of what FOOH can do for a product launch. 46M+ earned media impressions and 1.2M+ engagements across TikTok and Instagram. CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['tech product launch', 'iPhone', 'viral CGI video', 'smartphone marketing', 'Apple'],
  },
  hermes: {
    title: 'Hermès FOOH in Seoul: the Harmonie certification announced on the boutique facade',
    description:
      "Hermès wanted to announce the Harmonie certification of its new buildings in a way that matches the house's values of craftsmanship and excellence. Our cinematic mixed reality film, shot in front of the Hermès boutique in Seoul, blends architectural precision with a sense of balance and harmony. CGI and FOOH advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['luxury marketing', 'Hermès', 'sustainable architecture', 'corporate video', 'luxury retail'],
  },
  'macsf-ii': {
    title: 'MACSF FOOH: a giant Docteur Maboul in Paris for healthcare students',
    description:
      'MACSF wanted to promote its back-to-school offer for healthcare students with something memorable. Our mixed reality film puts a giant Docteur Maboul (the Operation board game) in the streets of Paris, playful CGI visuals to reach future doctors, nurses and pharmacists. Second FOOH film for the insurer. Fake out of home advertising by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['insurance marketing', 'student campaign', 'healthcare', 'board game', 'MACSF'],
  },
  coyote: {
    title: 'Coyote 20th anniversary FOOH: a barge on the Seine turned into a CGI stage',
    description:
      "For its 20th anniversary, Coyote wanted an activation that shows the driving assistant's spirit of innovation. Broadcast during the anniversary event on a barge along the Seine in Paris, our mixed reality film blends the real setting with CGI elements and turns the boat into a spectacular stage. FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['anniversary event', 'automotive tech', 'Seine', 'event video', 'brand celebration'],
  },
  rhode: {
    title: 'Rhode FOOH in Paris: the best-selling product on a giant scale across the city',
    description:
      "Concept imagined by KOSMO® for Rhode: the brand's best-selling product placed at giant scale in iconic Paris locations, in a mixed reality film built for social. Product, city and CGI in one shareable sequence to show what a beauty launch can look like in FOOH. Fake out of home and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['beauty marketing', 'skincare brand', 'Rhode', 'viral beauty video', 'cosmetics'],
  },
  psg: {
    title: 'PSG Champions League FOOH: the victory celebrated in mixed reality, 15M+ views',
    description:
      "To celebrate PSG's Champions League victory, a mixed reality film that brings the celebration into the streets of Paris: the team's iconic imagery at city scale, built to capture the energy of the moment and amplify fan enthusiasm. 15M+ earned media impressions and 350K+ engagements. Made for UEFA. FOOH and CGI sports advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['football marketing', 'PSG', 'Champions League', 'sports fan content', 'UEFA'],
  },
  uefa: {
    title: 'UEFA Champions League FOOH: PSG vs Inter Milan teased in Paris',
    description:
      'Ahead of the Champions League match between PSG and Inter Milan, UEFA wanted a teaser that builds anticipation. Our mixed reality film brings the intensity of the matchup into Paris, CGI visuals in a real setting, built to be shared by fans before the game. FOOH and 3D sports advertising by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['football marketing', 'UEFA', 'Champions League', 'match teaser', 'sports video'],
  },
  porsche: {
    title: 'Porsche Taycan FOOH concept: the electric sports car at city scale in Paris',
    description:
      "Concept imagined by KOSMO® around the Porsche Taycan: a mixed reality film that brings the car's performance and design into Paris, CGI visuals in a real street built to captivate and to be shared. Not a commissioned Porsche campaign, a demonstration of FOOH for automotive launches. CGI and fake out of home advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['automotive marketing', 'electric car', 'Porsche', 'car launch video', 'Taycan'],
  },
  'roland-garros': {
    title: 'Roland-Garros FOOH concept: the tournament teased across iconic Paris locations',
    description:
      'Concept imagined by KOSMO® for Roland-Garros: a mixed reality film set in iconic Paris locations that brings the energy of the tournament into the city before it starts, CGI tennis visuals in real settings, built to spark fan excitement on social. Not a commissioned campaign, a demonstration of FOOH for sports events. CGI advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['tennis marketing', 'sports event teaser', 'tournament promotion', 'CGI sports', 'Roland-Garros'],
  },
  minecraft: {
    title: "A Minecraft Movie FOOH: Paris turns blocky for the film's launch",
    description:
      'For the launch of the Minecraft movie, Mojang Studios wanted to engage the global Minecraft community. Our mixed reality film transports the iconic blocky world into the streets of Paris, CGI in a real setting, playful storytelling built for fans to share before the release. 350K+ earned media impressions. FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['movie marketing', 'gaming community', 'Minecraft', 'film launch', 'video game brand'],
  },
  'disney-lilo-and-stitch': {
    title: 'Lilo & Stitch FOOH concept in Bangkok: the Hawaiian universe in AI and mixed reality',
    description:
      'Concept imagined by KOSMO® around Lilo & Stitch: the characters and their vibrant Hawaiian universe brought into Bangkok through AI-generated visuals and mixed reality, a playful, shareable film built for fans. Not a commissioned Disney campaign. 555K+ earned media impressions and 50K+ engagements. FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['Disney', 'animated film marketing', 'AI video', 'family entertainment', 'Lilo and Stitch'],
  },
  'sogelym-dixence-i': {
    title: "La Clairière FOOH (1/3): Sogelym Dixence's biophilic offices come alive in Paris",
    description:
      "First of three mixed reality films for La Clairière, Sogelym Dixence's office project in Paris built around biophilic design and well-being. CGI brings the verdant facade, biosourced materials and inviting workspaces to life in a real setting, to show the connection between nature and the urban workplace. Real estate FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['real estate marketing', 'office development', 'biophilic design', 'property video', 'workplace'],
  },
  'sogelym-dixence-ii': {
    title: "La Clairière FOOH (2/3): the green facade of Sogelym Dixence's new offices",
    description:
      'Second film of the La Clairière series for Sogelym Dixence: a new angle on the green facade and the biosourced materials of the Paris office project, in mixed reality. Three films, one cohesive story about biophilic design and well-being at work. Real estate FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['real estate marketing', 'office development', 'biophilic design', 'property video', 'green building'],
  },
  'sogelym-dixence-iii': {
    title: "La Clairière FOOH (3/3): nature meets the workspace in Sogelym Dixence's project",
    description:
      'Third and last film of the La Clairière series for Sogelym Dixence: the inviting workspaces and the link between nature and the city, in mixed reality. A cohesive series to build awareness for an innovative, sustainable office development in Paris. Real estate FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['real estate marketing', 'office development', 'biophilic design', 'property video', 'sustainable offices'],
  },
  'renault-i': {
    title: 'Renault 5 electric FOOH (1/2): the R5 meets Roland-Garros',
    description:
      'To celebrate its partnership with Roland-Garros, Renault wanted to highlight the new electric R5 with a viral moment linking innovation, sport and culture. Our mixed reality film blends the R5 into the world of the tournament, CGI in a real setting. First of two films. 2M+ earned media impressions and 65K+ engagements across the campaign. Automotive FOOH by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['automotive marketing', 'electric car', 'Renault 5', 'Roland-Garros', 'sports sponsorship'],
  },
  'renault-ii': {
    title: 'Renault 5 electric FOOH (2/2): a second take on the R5 at Roland-Garros',
    description:
      "Second mixed reality film for Renault's Roland-Garros partnership: the new electric R5 in the iconic atmosphere of the tournament, CGI blended into the real setting to drive engagement on social. Two films, 2M+ earned media impressions and 65K+ engagements across the campaign. Automotive FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['automotive marketing', 'electric car', 'Renault 5', 'Roland-Garros', 'sports sponsorship'],
  },
  'maisons-du-monde-iv': {
    title: "Maisons du Monde FOOH: the Tangerine collection takes over Bordeaux's theatre",
    description:
      "For the launch of its Tangerine collection, Maisons du Monde wanted to stop people in their tracks. Our mixed reality film blends the collection's bold colours and furniture with the iconic theatre of Bordeaux, playful CGI that makes the pieces feel alive in the heart of the city. 1M+ earned media impressions and 10K+ engagements. Retail FOOH by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['furniture marketing', 'home decor', 'collection launch', 'retail video', 'Maisons du Monde'],
  },
  hiscox: {
    title: "Hiscox FOOH: the insurer's booth becomes a digital playground at Go Entrepreneur",
    description:
      "Hiscox wanted to stand out at the Go Entrepreneur trade show in Paris and connect with ambitious entrepreneurs. Our mixed reality film turns the booth into a digital playground, CGI visuals that bring the insurer's values to life on-site and on social. B2B event FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['insurance marketing', 'trade show activation', 'entrepreneurs', 'B2B event', 'Hiscox'],
  },
  'fk-agency-x-jardin-d-acclimatation': {
    title: "Jardin d'Acclimatation FOOH: a dragon announces Le Défi du Dragon in Paris",
    description:
      "With FK Agency, the Jardin d'Acclimatation wanted to announce its new attraction, Le Défi du Dragon, in a way that sparks excitement online. Our mixed reality film brings the dragon to life in the park, CGI in a real setting, so visitors feel the thrill before stepping in. 150K+ earned media impressions. Theme park FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['theme park marketing', 'new attraction launch', 'dragon', 'family entertainment', 'amusement park'],
  },
  'oysho-i': {
    title: 'Oysho x Premier Padel FOOH (1/3): the padel court comes to Rome',
    description:
      "Oysho wanted to celebrate its sponsorship and naming partnership with the Premier Padel League. First of three mixed reality films: the energy of the padel court brought into Rome, CGI in a real setting, with Oysho's stylish, sporty identity. 6M+ earned media impressions and 550K+ engagements across the series. Sportswear FOOH by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['sportswear marketing', 'padel', 'sports sponsorship', 'Oysho', 'Premier Padel'],
  },
  'oysho-ii': {
    title: 'Oysho x Premier Padel FOOH (2/3): padel energy in the streets of Milan',
    description:
      'Second film of the Oysho x Premier Padel series, shot in Milan: a new perspective on the padel court in the city, CGI in a real setting, built for fans to share. One cohesive series for the naming partnership, 6M+ earned media impressions and 550K+ engagements. Fashion and sports FOOH by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['sportswear marketing', 'padel', 'sports sponsorship', 'Oysho', 'Premier Padel'],
  },
  'oysho-iii': {
    title: 'Oysho x Premier Padel FOOH (3/3): the series ends in Valladolid',
    description:
      "Third film of the Oysho x Premier Padel series, in Valladolid: the padel action takes over the Spanish city in mixed reality, with Oysho's sporty identity front and centre. Across the three films, 6M+ earned media impressions and 550K+ engagements. Sportswear FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['sportswear marketing', 'padel', 'sports sponsorship', 'Oysho', 'Premier Padel'],
  },
  'maisons-du-monde-iii': {
    title: 'Maisons du Monde FOOH: the Spring collection blooms in the Luxembourg Garden',
    description:
      "To bring its Spring collection to life, Maisons du Monde wanted an immersive activation in Paris. Our mixed reality film sets the collection's colours, textures and pieces in the Jardin du Luxembourg, playful CGI in a real setting, built to be explored and shared. 2M+ earned media impressions and 20K+ engagements. Retail FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['home decor marketing', 'spring collection', 'Jardin du Luxembourg', 'furniture', 'Maisons du Monde'],
  },
  'uber-eats': {
    title: 'Uber Eats x Équipe de France FOOH: the partnership extended at Clairefontaine',
    description:
      'To celebrate the extension of its partnership with the French national football team, Uber Eats wanted a bold, playful activation. Our news-hacking mixed reality film, set at Clairefontaine, blends CGI with the spirit of Les Bleus. 25M+ earned media impressions and a TV broadcast. Food delivery FOOH and CGI sports advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['football sponsorship', 'Uber Eats', 'French national team', 'news hacking', 'sports marketing'],
  },
  'la-baleine': {
    title: 'La Baleine FOOH: the iconic sea salt brand reimagined in the streets of Paris',
    description:
      "La Baleine wanted to turn a familiar household product into a viral moment. Our mixed reality film brings the salt brand's iconic identity into the streets of Paris, playful CGI in a real setting, an everyday staple turned into a cultural moment built for sharing. FMCG FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['FMCG marketing', 'food brand', 'sea salt', 'viral product video', 'grocery brand'],
  },
  astorg: {
    title: 'Astorg FOOH: the annual general meeting invitation at the Fondation Louis Vuitton',
    description:
      "Astorg wanted its annual general meeting invitation to reflect the firm's innovative mindset. Our mixed reality film blends the Fondation Louis Vuitton in Paris with elegant CGI visuals, a refined narrative that goes beyond corporate communication and builds anticipation among participants. Corporate FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['corporate event invitation', 'private equity', 'AGM video', 'Fondation Louis Vuitton', 'corporate communication'],
  },
  'disney-la-haut': {
    title: "Là-Haut (Up) FOOH concept: Pixar's whimsical world over Paris in AI and mixed reality",
    description:
      "Concept imagined by KOSMO® around Là-Haut (Pixar's Up): a mixed reality journey that lifts Paris into the film's colourful, whimsical world, AI-generated visuals combined with CGI in a real setting, built to spark adventure and sharing. Not a commissioned Disney campaign. FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['Disney Pixar', 'animated film', 'AI generated video', 'family entertainment', 'Up movie'],
  },
  'maisons-du-monde-ii': {
    title: 'Maisons du Monde FOOH: Christmas baubles take over Paris',
    description:
      'Second Christmas film for Maisons du Monde: giant baubles from the collection take over Paris in mixed reality, a visually rich, playful sequence that highlights the warm spirit of the festive collection. 5M+ earned media impressions and 40K+ engagements. Retail FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['Christmas marketing', 'home decor', 'festive campaign', 'retail video', 'Maisons du Monde'],
  },
  'maisons-du-monde-i': {
    title: "Maisons du Monde FOOH: the Christmas collection film that became the brand's most viewed",
    description:
      "To launch its Christmas collection, Maisons du Monde wanted an activation that enchants and spreads. Our mixed reality film blends the brand's signature style with the magic of the season in Paris, CGI in a real setting. It became the most viewed and most liked video on the brand's account: 12M+ earned media impressions and 150K+ engagements. Retail FOOH by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['Christmas campaign', 'furniture brand', 'viral retail video', 'home decor', 'Maisons du Monde'],
  },
  'betclic-civ': {
    title: "Betclic Côte d'Ivoire FOOH: a Christmas contest in the streets of Abidjan",
    description:
      "For the festive season, Betclic wanted a playful Christmas contest that drives engagement in Côte d'Ivoire. Our mixed reality film immerses participants in a festive, interactive scene in Abidjan, CGI in a real setting, combining the excitement of the holidays with the brand's passion for sport and gaming. FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['sports betting marketing', 'Christmas contest', 'Africa campaign', 'Betclic', 'Ivory Coast'],
  },
  icade: {
    title: 'Icade FOOH: the reopening of the Pulse offices announced in mixed reality',
    description:
      'Icade wanted to announce the reopening of its Pulse offices with an activation that shows innovation. Our mixed reality film brings Pulse to life in Paris, CGI visuals that give a virtual taste of the modern, flexible workspaces and position the building as a destination for businesses. Real estate FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['real estate marketing', 'office space', 'property developer', 'workplace video', 'Icade'],
  },
  'proman-i': {
    title: 'Proman FOOH: the 2024 recruitment campaign in mixed reality',
    description:
      "For its 2024 recruitment campaign, Proman wanted to attract talent by showing a forward-thinking employer. Our mixed reality film brings the recruitment group's values and job opportunities into the streets of Paris, CGI in a real setting, built to capture attention and encourage applications. First FOOH film for Proman. Employer branding and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['recruitment campaign', 'employer branding', 'HR marketing', 'staffing agency', 'talent acquisition'],
  },
  'macsf-i': {
    title: 'MACSF FOOH: the Vendée Globe 2024 boat sails into Paris',
    description:
      "For the start of the Vendée Globe 2024, MACSF wanted to celebrate its athlete and vessel with a standout activation. Our mixed reality film brings the skipper and the boat into Paris, CGI in a real setting, to connect audiences with the thrill of the race and the insurer's adventurous side. First FOOH film for MACSF. Sports sponsorship FOOH by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['sailing sponsorship', 'Vendée Globe', 'insurance marketing', 'sports video', 'MACSF'],
  },
  'heavent-i': {
    title: 'Heavent 2024 FOOH (1/2): the event industry show announced in mixed reality',
    description:
      'For the 2024 edition of Heavent, the trade show of the event industry, Weyou Group wanted to announce the dates and show the salon as a hub of innovation. Our mixed reality film brings the event into Paris, CGI in a real setting, built to be shared by event professionals. First of two films. B2B FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['trade show marketing', 'event industry', 'B2B campaign', 'exhibition', 'Heavent'],
  },
  'heavent-ii': {
    title: 'Heavent 2024 FOOH (2/2): a second film to announce the trade show dates',
    description:
      'Second mixed reality film to announce the 2024 edition of Heavent in Paris: a new sequence that positions the trade show as the unmissable event of the industry, CGI in a real setting, built to create buzz among event professionals. B2B FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['trade show marketing', 'event industry', 'B2B campaign', 'exhibition', 'Heavent'],
  },
  bolero: {
    title: "Bolero FOOH: Aya Nakamura's Olympic opening ceremony performance in mixed reality",
    description:
      "Bolero wanted to ride Aya Nakamura's performance at the Paris 2024 Olympic opening ceremony to promote its platform. Our mixed reality film blends CGI visuals with the energy of the performance in Paris, music, motion and technology in one shareable sequence that positions Bolero as a culturally connected brand. FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['music platform marketing', 'Olympic Games', 'Aya Nakamura', 'Paris 2024', 'news hacking'],
  },
  'havas-africa': {
    title: 'Havas Play Africa FOOH: the platform launched in Abidjan in mixed reality',
    description:
      'To launch Havas Play in Africa, Havas wanted an activation that highlights innovation and speaks to audiences across the continent. Our mixed reality film brings Havas Play to life in Abidjan, CGI in a real setting, culturally resonant content that positions the platform as a creative hub in Africa. Agency FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['agency launch', 'Africa marketing', 'Havas', 'brand launch video', 'Ivory Coast'],
  },
  jylor: {
    title: "Jylor FOOH: the Paris pop-up store launch that became the brand's most viewed video",
    description:
      "For the opening of its Paris pop-up store, Jylor (founded by Jessica Thinnevin) wanted a video that shows its beauty products and drives buzz. Our mixed reality film brings the pop-up to life, vibrant CGI, product highlights and playful storytelling. It became the most viewed video on the brand's account: 2.5M+ earned media impressions and 100K+ engagements. Beauty FOOH by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['beauty brand marketing', 'pop-up store', 'cosmetics launch', 'influencer brand', 'Jylor'],
  },
  extreme: {
    title: 'Extrême FOOH: the new summer packaging comes alive in Paris, 15M+ impressions',
    description:
      'To launch its new summer packaging, Extrême wanted a playful activation that boosts visibility. Our mixed reality film brings the packaging to life in the streets of Paris, vibrant CGI, summer energy and a sequence built to be shared. 15M+ earned media impressions and 50K+ engagements. FMCG FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['packaging launch', 'FMCG marketing', 'summer campaign', 'viral product video', 'Extrême'],
  },
  icemoon: {
    title: 'Icemoon FOOH: the hero product of the new collection in the streets of Paris',
    description:
      "To launch its new collection, Icemoon wanted to spotlight its standout product with something buzzworthy. Our mixed reality film brings the hero product to life in Paris, dynamic CGI, the brand's signature aesthetic, a shareable moment that positions Icemoon as a trend-forward label. Fashion FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['fashion brand marketing', 'collection launch', 'streetwear', 'product video', 'Icemoon'],
  },
  'doumbe-vs-zebo': {
    title: 'Doumbé vs Zebo FOOH: the fight hyped in mixed reality, 50M+ views and TV airtime',
    description:
      'Concept imagined by KOSMO® around the anticipated fight between Cédric Doumbé and Zebo: a mixed reality film that brings the intensity of the bout into the streets of Paris, CGI in a real setting with a playful, powerful narrative. The video went viral, 50M+ earned media impressions, 2M+ engagements and airtime on television. Sports FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['MMA marketing', 'combat sports', 'viral sports video', 'Cédric Doumbé', 'fight promotion'],
  },
  kof: {
    title: 'King of Fighters FOOH: Lille becomes a KOF arena for the fighting game event',
    description:
      'For the King of Fighters event in Lille, the organisers wanted a thrilling activation for the fighting game community. Our mixed reality film brings the energy and iconic characters of KOF into the city, CGI in a real setting, built to be shared on-site and online and to position the event as a must-see. Gaming FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.',
    keywords: ['esports marketing', 'fighting game', 'gaming event', 'video game community', 'King of Fighters'],
  },
  'squid-game-i': {
    title: 'Squid Game season 3 FOOH (1/3): the show invades Paris, 150M+ views across the series',
    description:
      "For the launch of Squid Game season 3, Netflix wanted a series of bold mixed reality drops to immerse fans and keep the conversation going. First film: the show's iconic universe brought into the streets of Paris, CGI in a real setting. Across the three films, 150M+ earned media impressions and 10M+ engagements on TikTok and Instagram. Entertainment FOOH by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['Netflix', 'Squid Game', 'series launch', 'viral entertainment video', 'streaming marketing'],
  },
  'squid-game-ii': {
    title: 'Squid Game season 3 FOOH (2/3): a second mixed reality drop in Paris',
    description:
      "Second film of the Squid Game season 3 series for Netflix: a new perspective on the show's world in Paris, CGI in a real setting, one of three content drops built to captivate fans and spark conversation. Across the series, 150M+ earned media impressions and 10M+ engagements. Entertainment FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.",
    keywords: ['Netflix', 'Squid Game', 'series launch', 'viral entertainment video', 'streaming marketing'],
  },
  'squid-game-iii': {
    title: 'Squid Game season 3 FOOH (3/3): the last mixed reality drop in Paris',
    description:
      "Third and last drop of the Squid Game season 3 series for Netflix in Paris: a final mixed reality perspective on the show's universe, CGI in a real setting. One cohesive series, 150M+ earned media impressions and 10M+ engagements across TikTok and Instagram. Entertainment FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['Netflix', 'Squid Game', 'series launch', 'viral entertainment video', 'streaming marketing'],
  },
  'asus-ii': {
    title: 'Asus Zenbook A14 FOOH: the ultra-light laptop demonstrated in mixed reality in Paris',
    description:
      "To launch the Zenbook A14, Asus wanted to show the laptop's groundbreaking lightness. Our mixed reality film brings the Zenbook A14 into Paris, CGI in a real setting that visually emphasises the ultra-light design so audiences feel the difference and share it. 530K+ earned media impressions and 35K+ engagements. Tech FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['laptop launch', 'tech marketing', 'Asus Zenbook', 'product demo video', 'consumer electronics'],
  },
  'asus-i': {
    title: 'Asus Zenbook S14 FOOH: the laptop exhibited like a work of art in Paris',
    description:
      'For the launch of the Zenbook S14, Asus wanted the laptop seen as a work of art. Our mixed reality film places the Zenbook S14 in a museum-like setting in Paris, CGI and elegant storytelling that highlight its sleek design and craftsmanship. 210K+ earned media impressions and 4.8K+ engagements. Tech FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['laptop launch', 'tech marketing', 'Asus Zenbook', 'design product video', 'consumer electronics'],
  },
  bose: {
    title: 'Bose FOOH: premium sound turned into a mixed reality ad in Paris',
    description:
      "Bose wanted to elevate its advertising with a mixed reality activation that immerses audiences in premium audio. Our film turns sound into a visually captivating CGI experience in Paris, built to show the brand's innovation and drive interaction on social. Tech FOOH and 3D advertising by KOSMO®, CGI agency in Paris and Dubai.",
    keywords: ['audio brand marketing', 'headphones', 'speakers', 'Bose', 'consumer electronics'],
  },
  pringles: {
    title: 'Pringles x Super Mario FOOH: the collab can comes alive in Paris',
    description:
      'To celebrate its new can created with Nintendo and Super Mario Bros, Pringles wanted a highly shareable moment. Our mixed reality film blends the iconic can with the colourful world of Super Mario in the streets of Paris, CGI, pop culture references and playful storytelling built for social. FMCG FOOH and CGI advertising by KOSMO®, agency in Paris and Dubai.',
    keywords: ['snack brand marketing', 'Nintendo collaboration', 'Super Mario', 'FMCG launch', 'Pringles'],
  },
};

/* ---------- construction ---------- */

const encodeMedia = (url) => url.replace(/\*/g, '%2A').replace(/'/g, '%27');
const mediaUrl = (p) => {
  const src = MEDIA_OVERRIDES[p.slug] ?? p.media.mainVideo.replace(/\?.*$/, '');
  return src.startsWith('/') ? `${SITE}${src}` : encodeMedia(src);
};
const thumbUrl = (p) => `${SITE}/images/fooh/${p.slug}.jpg`;
const linkUrl = (p) => `${SITE}/work/fooh/${p.slug}?${UTM}`;
const boardOf = (p) => BOARD_OVERRIDES[p.slug] ?? BOARDS[p.industry] ?? 'FOOH Campaigns';

const startArg = opt('start');
const start = startArg ? new Date(`${startArg}T00:00:00Z`) : new Date(Date.now() + 86_400_000);
start.setUTCHours(0, 0, 0, 0);
/** Deux épingles par jour, 09:00 et 16:00 UTC, dans l'ordre du fichier. */
const publishDate = (i) => {
  if (flag('no-schedule')) return '';
  const d = new Date(start.getTime() + Math.floor(i / 2) * 86_400_000);
  d.setUTCHours(i % 2 === 0 ? 9 : 16);
  return d.toISOString().replace(/\.\d{3}Z$/, '');
};

const ordered = [...projects.filter((p) => !p.restrictedClient), ...projects.filter((p) => p.restrictedClient)];
const errors = [];
const rows = ordered.map((p, i) => {
  const c = COPY[p.slug];
  if (!c) errors.push(`${p.slug}: pas de texte dans COPY`);
  const title = c?.title ?? '';
  const description = c?.description ?? '';
  if (title.length > TITLE_MAX) errors.push(`${p.slug}: titre ${title.length} > ${TITLE_MAX}`);
  if (description.length > DESC_MAX) errors.push(`${p.slug}: description ${description.length} > ${DESC_MAX}`);
  const city = p.location?.confidence !== 'low' ? p.location?.city : undefined;
  const keywords = [...BASE_KEYWORDS, ...(c?.keywords ?? []), city, p.location?.country].filter(Boolean);
  return [title, mediaUrl(p), boardOf(p), thumbUrl(p), description, linkUrl(p), publishDate(i), keywords.join(', ')];
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const HEADER = ['Title', 'Media URL', 'Pinterest board', 'Thumbnail', 'Description', 'Link', 'Publish date', 'Keywords'];
const cell = (v) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const csv = [HEADER, ...rows].map((r) => r.map(cell).join(',')).join('\r\n') + '\r\n';
mkdirSync('docs/pinterest', { recursive: true });
writeFileSync(OUT, csv, 'utf8');

const restricted = ordered.filter((p) => p.restrictedClient).length;
console.log(`${OUT} : ${rows.length} épingles (${restricted} marques à accord en fin de fichier), ${new Set(rows.map((r) => r[2])).size} tableaux`);
if (!flag('no-schedule')) console.log(`Publication : du ${rows[0][6]} au ${rows.at(-1)[6]} (UTC), 2 par jour`);

/* ---------- vérification HTTP optionnelle ---------- */
if (flag('check')) {
  const urls = [...new Set(rows.flatMap((r) => [r[1], r[3], r[5]]))];
  let bad = 0;
  await Promise.all(
    urls.map(async (u) => {
      try {
        const res = await fetch(u, { method: 'HEAD', redirect: 'follow' });
        if (!res.ok) {
          bad++;
          console.error(`${res.status} ${u}`);
        }
      } catch (e) {
        bad++;
        console.error(`ERR ${u} (${e.message})`);
      }
    }),
  );
  console.log(bad ? `${bad} URL en erreur sur ${urls.length}` : `${urls.length} URL vérifiées, toutes répondent`);
  if (bad) process.exit(1);
}
