/**
 * Contenu du site IA (US, anglais). Une entrée par page de service, mots-clés repris du plan Semrush du 02/11/2026.
 * Les films montrés sont les projets de src/data/fooh/projects.json (aucun DOOH). Ce sont des films CGI / réalité mixte
 * du studio KOSMO®, sauf les deux concepts Disney marqués IA dans leur fiche : le texte ne les présente jamais comme
 * des films « faits à l'IA ». À valider : prix, délais propres à l'IA, droits d'usage (voir AI-SITE-NOTES.md).
 */

export interface Deliverable {
  icon: string;
  title: string;
  text: string;
}
export interface QA {
  question: string;
  answer: string;
}
export interface AiService {
  slug: string;
  /** Libellé court (nav, footer, cartes). */
  label: string;
  /** Une ligne pour les cartes et le menu. */
  blurb: string;
  /** Mot-clé principal de la page, repris dans le H1, le title et la première phrase. */
  keyword: string;
  seo: { title: string; description: string };
  /** `project` : film du studio (projects.json) ; `work` : production IA (ai-work.ts), prioritaire ; `image` : visuel fixe. */
  hero: { title: string; soft?: string; subtitle: string; project: string; work?: string; image?: string };
  /** Productions IA montrées sur la page (slugs de ai-work.ts). */
  works?: string[];
  intro: { heading: string; text: string[] };
  deliverables: { heading: string; items: Deliverable[] };
  /** Projets montrés (slugs de projects.json). */
  projects: string[];
  faq: QA[];
  related: string[];
}

export const services: AiService[] = [
  {
    slug: 'ai-video-production',
    label: 'AI video production',
    blurb: 'Brand films, product videos and social content, produced with AI.',
    keyword: 'AI video production company',
    seo: {
      title: 'AI Video Production Company for Brands | KOSMO® AI',
      description: 'KOSMO® is an AI video production company and AI video agency: brand films, product videos and social content made with generative AI and a real CGI team.',
    },
    hero: {
      title: 'AI video production, made by a real studio.',
      subtitle: 'An AI video agency for brands that want films people watch to the end. Generative AI for speed and scale, a CGI team for the finish.',
      project: 'disney-la-haut',
      work: 'oakley-ai-tv-spot',
    },
    intro: {
      heading: 'An AI video production company with a craft team behind it.',
      text: [
        'KOSMO® is an AI video production company. We write, generate, animate and finish brand videos with generative AI, then a team of 3D artists, editors and compositors takes every shot to broadcast quality.',
        'Most AI video looks like AI video. Ours comes from the studio behind mixed reality films for Netflix, Zalando, Miele and Renault, so the bar is the one our clients already hold us to: films that hold up on a big screen and travel on social.',
      ],
    },
    deliverables: {
      heading: 'What our AI video production services cover.',
      items: [
        { icon: 'video', title: 'Brand films', text: 'Launch films and hero videos for campaigns, from 15 seconds to two minutes, with one consistent world from the first frame to the packshot.' },
        { icon: 'cube', title: 'Product videos', text: 'Your product placed in scenes you could never shoot: in the clouds, under water, in a city that does not exist.' },
        { icon: 'share', title: 'Social cutdowns', text: 'Every format your channels need, 9:16, 1:1 and 16:9, cut and paced for each platform instead of cropped.' },
        { icon: 'users', title: 'Corporate video', text: 'AI corporate video production for internal launches, events and recruitment, without a week of filming.' },
        { icon: 'sparkles', title: 'Post-production', text: 'AI post-production services on footage you already have: new backgrounds, extended shots, VFX and clean-ups.' },
        { icon: 'world', title: 'Versions at scale', text: 'One film adapted for markets, languages and seasons, so a campaign stays consistent in every country.' },
      ],
    },
    works: ['gucci-ai-fashion-film', 'tui-egypt', 'memoria-dernier-rayon', 'zara-ai-fashion-film', 'tui-suitcase', 'polene-ai-product-film'],
    projects: ['disney-la-haut', 'disney-lilo-and-stitch', 'below-statue-of-liberty', 'zalando-lounge-balance', 'miele-hydroclean', 'porsche'],
    faq: [
      { question: 'What does an AI video production company do?', answer: 'It turns a brief into finished brand films using generative AI for images, motion and sound, with people directing and finishing the work. At KOSMO®, AI covers concept frames, generation and variations; our 3D and post-production team handles consistency, compositing, color and the final delivery.' },
      { question: 'Is AI video good enough for a brand campaign?', answer: 'On its own, rarely. Raw generations drift from shot to shot and fall apart on a big screen. Combined with CGI, compositing and a real edit, it reaches campaign quality. That combination is the whole point of working with a studio rather than a tool.' },
      { question: 'How long does AI video production take?', answer: 'Most projects run 3 to 4 weeks from an approved brief to delivery, with 2 rounds of revisions included. We share a timeline with dates on the first call.' },
      { question: 'Can you work with our existing footage and assets?', answer: 'Yes. We extend, restyle and finish footage you already own, and we can build your product in 3D from packshots or CAD files so it stays exact in every shot.' },
      { question: 'Do you only work with US brands?', answer: 'No. We work worldwide, with recent work in the United States, France, Japan and across Europe.' },
    ],
    related: ['ai-commercials', 'ai-animated-commercials', 'ai-ugc-agency'],
  },
  {
    slug: 'ai-commercials',
    label: 'AI commercials',
    blurb: 'Ads for social, digital and TV, built to stop the scroll.',
    keyword: 'AI commercial production',
    seo: {
      title: 'AI Commercials and AI Ad Agency for Brands | KOSMO® AI',
      description: 'AI commercial production for social, digital and TV: an AI ad agency for scroll-stopping ads and TV commercial production, delivered in every format.',
    },
    hero: {
      title: 'AI commercials people actually stop for.',
      subtitle: 'An AI ad agency for social, digital and TV campaigns. One idea, made impossible to scroll past, delivered in every format.',
      project: 'zalando-prive-tennis',
      work: 'alaia-ai-tv-spot',
    },
    intro: {
      heading: 'AI commercial production for the feed.',
      text: [
        'On social, an ad has a second to earn attention. AI commercial production lets us show your product doing something it never could on a set: a giant ball on a Paris fountain, a laptop in a museum, a whole season of fashion balanced on a bench.',
        'As an AI ad agency, we start from the idea, not the tool. Then we generate, animate and finish the ad, and deliver every version your paid and organic plans need.',
        'The same production also covers TV commercial production: 15, 30 and 60 second spots for national TV and streaming, delivered to broadcast and CTV specs, with cutdowns made alongside the hero spot instead of after it.',
      ],
    },
    deliverables: {
      heading: 'What our AI ad agency delivers.',
      items: [
        { icon: 'bulb', title: 'The idea', text: 'A concept built around one twist people want to share, tested in frames before production.' },
        { icon: 'video', title: 'Hero ad', text: 'The main film, generated and finished with CGI so the product stays exact.' },
        { icon: 'share', title: 'Every format', text: 'Reels, TikTok, YouTube, display and CTV versions, each paced for its platform.' },
        { icon: 'device-screen', title: 'TV and CTV spots', text: 'TV ad production for 15, 30 and 60 second spots, delivered to the specs of the networks and streaming platforms on your plan.' },
        { icon: 'trending-up', title: 'Variations for testing', text: 'Hooks, openings and endings in several versions, so your media team can test what performs.' },
      ],
    },
    works: ['oakley-ai-tv-spot', 'loewe-ai-social', 'etam-live-show-cake', 'alaia-ai-tv-spot', 'memoria-jardin-interdit', 'tui-brazil'],
    projects: ['zalando-prive-tennis', 'asus-i', 'pringles', 'la-baleine', 'bose', 'maisons-du-monde-ii'],
    faq: [
      { question: 'What is an AI commercial?', answer: 'An ad where images, motion or sound are generated with AI instead of filmed. The best ones use AI for what a camera cannot do, and keep the product and the brand exact with CGI and careful finishing.' },
      { question: 'What does an AI ad agency do that an AI tool does not?', answer: 'The idea, the consistency and the finish. Tools generate shots. An agency writes the concept, keeps your product and characters identical from shot to shot, fixes what the model gets wrong and delivers files your media team can run.' },
      { question: 'Do you produce TV commercials with AI?', answer: 'Yes. We handle TV commercial production from the script and the AI animatic to the broadcast master: 15, 30 and 60 second spots for national TV and streaming, cleared and delivered to network and CTV specs like any other spot.' },
      { question: 'How many versions do we get?', answer: 'We agree the list of formats and variations with you at the brief, so the price and the timeline cover everything your plan needs.' },
      { question: 'Will people know the ad was made with AI?', answer: 'They will notice the idea, not the tool. We avoid the uncanny AI look and we follow the disclosure rules of each platform when they apply.' },
    ],
    related: ['ai-ugc-agency', 'ai-video-production', 'ai-fashion-beauty'],
  },
  {
    slug: 'ai-animated-commercials',
    label: 'AI animated commercials',
    blurb: 'Animated spots and characters, from 3D to stylized worlds.',
    keyword: 'animated commercial production',
    seo: {
      title: 'Animated Commercial Production with AI | KOSMO® AI',
      description: 'Animated commercial production with AI and 3D: characters, worlds and product animation for brands, from a 15 second spot to a full campaign.',
    },
    hero: {
      title: 'Animated commercials, without the animation timeline.',
      subtitle: 'Characters, worlds and product stories in 3D or stylized animation, produced with AI and finished by animators.',
      project: 'super-mario-galaxy-yoshi-eggs',
      work: 'all-quiet-teaser',
    },
    intro: {
      heading: 'Animated commercial production that keeps its charm.',
      text: [
        'Animation sells what live action cannot: a mascot, a feeling, a product explained in ten seconds. Traditional animated commercial production takes months. With AI in the pipeline, the look development and the shots move much faster.',
        'Our animators direct the characters and the timing, AI generates and extends the frames, and our 3D team keeps your product and your mascot on model in every shot.',
      ],
    },
    deliverables: {
      heading: 'Animation for brands.',
      items: [
        { icon: 'sparkles', title: 'Look development', text: 'Two or three styles explored in frames before we commit, from photoreal 3D to illustration.' },
        { icon: 'users', title: 'Characters and mascots', text: 'Your mascot built once and kept consistent in every film, pose and format.' },
        { icon: 'cube', title: 'Product animation', text: 'Your product animated in 3D, accurate to the real thing, inside an animated world.' },
        { icon: 'video', title: 'Spots and series', text: 'A single spot or a series of short films for social, with the same world across all of them.' },
      ],
    },
    works: ['all-quiet-teaser', 'tui-suitcase', 'loewe-ai-social', 'etam-live-show-alarm', 'polene-ai-product-film', 'tui-brazil'],
    projects: ['super-mario-galaxy-yoshi-eggs', 'minecraft', 'disney-lilo-and-stitch', 'hiscox', 'france-tv', 'fk-agency-x-jardin-d-acclimatation'],
    faq: [
      { question: 'Can AI animation keep a character consistent?', answer: 'Not by itself. We build the character once, in 3D or as a reference set, and use it to control every generation, then animators fix what drifts. That is how a mascot stays on model across a campaign.' },
      { question: 'What styles can you produce?', answer: 'Photoreal 3D, stylized 3D, illustrated and mixed styles. We show you frames in two or three directions before production starts.' },
      { question: 'How long is an animated commercial?', answer: 'Usually 15 to 60 seconds, with shorter cutdowns for social. Series of short films are common too.' },
    ],
    related: ['ai-commercials', 'ai-explainer-videos', 'ai-music-videos'],
  },
  {
    slug: 'ai-fashion-beauty',
    label: 'AI fashion & beauty',
    blurb: 'Lookbooks, virtual models and campaigns for fashion and beauty.',
    keyword: 'AI fashion campaign',
    seo: {
      title: 'AI Fashion Campaigns, Lookbooks and Virtual Models | KOSMO® AI',
      description: 'AI fashion and beauty production: AI lookbooks, AI fashion photography, virtual models and campaign films for fashion, beauty and luxury brands.',
    },
    hero: {
      title: 'Fashion and beauty campaigns, generated with taste.',
      subtitle: 'AI lookbooks, virtual models and campaign films for fashion, beauty and luxury brands, art directed like a real shoot.',
      project: 'zalando-lounge-balance',
      work: 'zara-ai-fashion-film',
    },
    intro: {
      heading: 'AI fashion campaigns that still look like your brand.',
      text: [
        'Fashion moves faster than shoot calendars. With AI fashion photography, a new drop can have its lookbook, its campaign images and its social films in days, on models and in places that fit the collection.',
        'We keep the garments true to the real ones, the casting consistent from image to image and the mood in line with your brand book, so the result reads as your campaign, not as an AI experiment.',
      ],
    },
    deliverables: {
      heading: 'For fashion, beauty and luxury.',
      items: [
        { icon: 'file-text', title: 'AI lookbook', text: 'The full collection on consistent virtual models, in looks and locations chosen with you.' },
        { icon: 'users', title: 'Virtual models', text: 'A cast built for your brand and reused season after season, always the same faces.' },
        { icon: 'eye', title: 'Beauty close-ups', text: 'Texture, shine and color for skincare, makeup and fragrance, at macro scale.' },
        { icon: 'video', title: 'Campaign films', text: 'Short films for launches and social, in the same world as the stills.' },
      ],
    },
    works: ['gucci-ai-fashion-film', 'lanvin-ai-social', 'balenciaga-ai-social', 'zara-ai-fashion-film', 'memoria-dernier-rayon', 'polene-ai-product-film'],
    projects: ['zalando-lounge-balance', 'oysho-i', 'icemoon', 'rhode', 'jylor', 'extreme'],
    faq: [
      { question: 'Can AI show our real garments?', answer: 'Yes. We work from your products, flat lays or samples, and check every look against the real piece: cut, fabric, color and logo.' },
      { question: 'Can we keep the same model across campaigns?', answer: 'Yes. We create a virtual cast for your brand and keep it consistent, so the same faces come back each season.' },
      { question: 'Is AI fashion photography right for luxury brands?', answer: 'For many uses, yes: lookbooks, social, early campaign visuals and impossible sets. The level of art direction and retouching is what makes it read as luxury.' },
    ],
    related: ['ai-influencers', 'ai-commercials', 'ai-ugc-agency'],
  },
  {
    slug: 'ai-ugc-agency',
    label: 'AI UGC ads',
    blurb: 'UGC-style ads at the volume performance teams need.',
    keyword: 'AI UGC agency',
    seo: {
      title: 'AI UGC Agency: UGC Ads at Scale | KOSMO® AI',
      description: 'An AI UGC agency for performance teams: UGC-style ads, hooks and variations produced at scale with AI, scripted by people and built to test.',
    },
    hero: {
      title: 'UGC ads at the speed your tests need.',
      subtitle: 'An AI UGC agency for brands and performance teams: scripted, produced and versioned so you can test more hooks every week.',
      project: 'neoness',
      work: 'tui-brazil',
    },
    intro: {
      heading: 'An AI UGC agency built for testing.',
      text: [
        'UGC ads work because they feel native to the feed. The problem is volume: every winning ad needs dozens of new hooks, angles and creators to keep performing.',
        'As an AI UGC agency, we write the scripts from your best performers, produce the videos with AI and your real product, and deliver them in batches your media team can test. Human creators can be mixed in when you need them.',
      ],
    },
    deliverables: {
      heading: 'What a UGC batch includes.',
      items: [
        { icon: 'file-text', title: 'Scripts and hooks', text: 'Angles and openings written from your data, your reviews and what already converts.' },
        { icon: 'users', title: 'Consistent personas', text: 'A set of presenters that fit your audience, reused across batches.' },
        { icon: 'video', title: 'Ad variations', text: 'Several hooks and endings for each script, delivered in 9:16 and 1:1.' },
        { icon: 'trending-up', title: 'Iteration', text: 'New batches built from what your tests tell us, every week or every month.' },
      ],
    },
    works: ['etam-live-show-cake', 'etam-live-show-shower', 'etam-live-show-alarm', 'tui-brazil', 'tui-egypt', 'memoria-dernier-rayon'],
    projects: ['neoness', 'keepcool', 'extreme', 'la-baleine', 'betclic-civ', 'uber-eats'],
    faq: [
      { question: 'What is an AI UGC ad?', answer: 'A short video in the style of user-generated content, where the presenter, the scene or both are produced with AI. It keeps the native feel of UGC while making it possible to test far more variations.' },
      { question: 'Is AI UGC allowed on Meta and TikTok?', answer: 'Yes, within each platform’s rules. We label AI content where the platform requires it and we never make claims a real customer did not make.' },
      { question: 'Can you mix AI and human creators?', answer: 'Yes. Many brands keep human creators for their best angles and use AI to multiply hooks and versions around them.' },
    ],
    related: ['ai-commercials', 'ai-influencers', 'ai-fashion-beauty'],
  },
  {
    slug: 'ai-music-videos',
    label: 'AI music videos',
    blurb: 'Music videos, visualizers and lyric videos for artists and labels.',
    keyword: 'music video production company',
    seo: {
      title: 'AI Music Video Production Company | KOSMO® AI',
      description: 'A music video production company working with AI: music videos, animated music videos, visualizers and lyric videos for artists and labels.',
    },
    hero: {
      title: 'Music video production with no limits on the set.',
      subtitle: 'Music videos, visualizers and lyric videos for artists and labels, produced with AI and finished by a CGI team.',
      project: 'nrj-x-fini',
    },
    intro: {
      heading: 'A music video production company for the AI era.',
      text: [
        'A great music video builds a world around a song. With AI, that world no longer depends on the location budget: a city made of light, a dream that changes with every bar, an animated story that follows the lyrics.',
        'We direct the treatment with the artist, generate and animate the scenes, then edit to the track and finish every shot. The result is a music video that looks like a big production, not like a filter.',
      ],
    },
    deliverables: {
      heading: 'For artists and labels.',
      items: [
        { icon: 'video', title: 'Music videos', text: 'The full video, from treatment to final edit, with or without performance footage.' },
        { icon: 'sparkles', title: 'Animated music videos', text: 'A story told in animation, in the style that fits the record.' },
        { icon: 'file-text', title: 'Lyric videos', text: 'Lyric videos that feel designed, not templated, for streaming and YouTube.' },
        { icon: 'share', title: 'Visualizers and social', text: 'Loops for Spotify Canvas, visualizers and vertical clips for the release campaign.' },
      ],
    },
    works: ['oakley-ai-tv-spot', 'memoria-dernier-rayon', 'balenciaga-ai-social', 'gucci-ai-fashion-film', 'lanvin-ai-social', 'tui-egypt'],
    projects: ['nrj-x-fini', 'bolero', 'extreme', 'france-tv', 'below-niagara-falls', 'kof'],
    faq: [
      { question: 'Can you use footage of the artist?', answer: 'Yes. We can film or use existing performance footage and build the AI world around it, or create the artist as a consistent character with their consent.' },
      { question: 'What does an AI music video include?', answer: 'A treatment, look development frames, the generated and animated scenes, the edit to the track and the color and finishing. Release assets like visualizers and vertical clips can be added.' },
      { question: 'Do you make lyric videos?', answer: 'Yes, as a standalone project or alongside the main video, designed in the same world.' },
    ],
    related: ['ai-animated-commercials', 'ai-video-production', 'ai-commercials'],
  },
  {
    slug: 'ai-explainer-videos',
    label: 'AI explainer videos',
    blurb: 'Explainer and product videos for SaaS, apps and tech.',
    keyword: 'SaaS explainer video',
    seo: {
      title: 'AI Explainer Videos for SaaS and Tech | KOSMO® AI',
      description: 'An explainer video company using AI: SaaS explainer videos, app promo videos and product launch films that make complex products simple.',
    },
    hero: {
      title: 'Explainer videos that make complex products simple.',
      subtitle: 'SaaS explainer videos, app promo videos and product launch films, scripted by people and produced with AI and 3D.',
      project: 'hiscox',
    },
    intro: {
      heading: 'An explainer video company for SaaS and tech.',
      text: [
        'A good SaaS explainer video answers one question fast: why should I care? We write the script around your buyer, design the visual system around your product and produce the film with AI, 3D and motion design.',
        'Because the production runs in the studio, the explainer stays easy to update when the product changes, and every feature can get its own short version.',
      ],
    },
    deliverables: {
      heading: 'What an explainer project includes.',
      items: [
        { icon: 'file-text', title: 'Script', text: 'A script written for your buyer, tested on your sales team before production.' },
        { icon: 'sparkles', title: 'Visual system', text: 'A style built from your brand and UI, reusable in every future video.' },
        { icon: 'video', title: 'Explainer film', text: 'The main explainer, usually 60 to 90 seconds, with voice over and sound design.' },
        { icon: 'device-screen', title: 'App and feature videos', text: 'Short app promo videos and feature clips for your site, stores and sales decks.' },
      ],
    },
    works: ['all-quiet-teaser', 'tui-suitcase', 'polene-ai-product-film', 'loewe-ai-social', 'etam-live-show-alarm', 'tui-brazil'],
    projects: ['hiscox', 'proman-i', 'icade', 'astorg', 'macsf-i', 'heavent-i'],
    faq: [
      { question: 'How long should a SaaS explainer video be?', answer: 'Usually 60 to 90 seconds for the main film, and 15 to 30 seconds for feature and ad versions.' },
      { question: 'Can you show our real product interface?', answer: 'Yes. We work from your UI and recordings and redesign the screens for video so they stay readable.' },
      { question: 'Can the video be updated later?', answer: 'Yes. Scenes, voice over and screens can be updated when the product changes, without starting over.' },
    ],
    related: ['ai-animated-commercials', 'ai-video-production', 'ai-commercials'],
  },
  {
    slug: 'ai-influencers',
    label: 'AI influencers',
    blurb: 'Virtual influencers and brand ambassadors, built for your brand.',
    keyword: 'AI influencer agency',
    seo: {
      title: 'AI Influencer Agency: Virtual Brand Ambassadors | KOSMO® AI',
      description: 'An AI influencer agency for brands: virtual influencers and AI brand ambassadors designed, produced and kept consistent across every campaign.',
    },
    hero: {
      title: 'An AI influencer that belongs to your brand.',
      subtitle: 'Virtual influencers and AI brand ambassadors, designed with you and produced consistently across content, campaigns and seasons.',
      project: 'rhode',
      work: 'ai-influencer-character',
    },
    intro: {
      heading: 'An AI influencer agency for brands.',
      text: [
        'A virtual influencer gives a brand a face that is always available, always on brand and never tied to another label. The hard part is not creating one image. It is keeping the same person, voice and personality across hundreds of posts.',
        'As an AI influencer agency, we design the character with you, build the references that keep it consistent and produce the content: photos, short videos and campaign appearances.',
      ],
    },
    deliverables: {
      heading: 'From character to content plan.',
      items: [
        { icon: 'users', title: 'Character design', text: 'Look, personality, voice and limits, defined with your brand team.' },
        { icon: 'shield-check', title: 'Consistency system', text: 'The references that keep the same face and style in every image and video.' },
        { icon: 'video', title: 'Content production', text: 'Photos, reels and stories produced every month for your channels.' },
        { icon: 'sparkles', title: 'Campaign appearances', text: 'Your ambassador inside your ads, launches and events.' },
      ],
    },
    works: ['ai-influencer-character', 'lanvin-ai-social', 'balenciaga-ai-social', 'memoria-dernier-rayon', 'loewe-ai-social', 'polene-ai-product-film'],
    projects: ['rhode', 'jylor', 'oysho-i', 'icemoon', 'zalando-lounge-balance', 'extreme'],
    faq: [
      { question: 'What is an AI influencer?', answer: 'A virtual character that posts and appears in campaigns like a real influencer. For a brand, it works as an ambassador the brand fully owns.' },
      { question: 'Who owns the AI influencer?', answer: 'The ownership of the character is set in the contract before work starts. The usual setup is that the brand owns the character it commissions.' },
      { question: 'Do we have to say it is AI?', answer: 'Yes, where platforms or local rules require it, and we recommend being open about it. Audiences accept virtual ambassadors; they do not accept being misled.' },
    ],
    related: ['ai-fashion-beauty', 'ai-ugc-agency', 'ai-commercials'],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const serviceHref = (s: AiService) => `/${s.slug}`;

/** Ordre du menu : quatre services en vedette (bandes avec image), puis les autres sur une grille. */
export const featuredServices = ['ai-video-production', 'ai-commercials', 'ai-ugc-agency', 'ai-fashion-beauty'];

export const home = {
  seo: {
    title: 'AI Creative Agency for Brands | KOSMO® AI',
    description: 'KOSMO® is an AI creative agency and AI design agency for brands: AI commercials, UGC ads, music videos and campaigns, made by a real CGI studio.',
  },
  hero: {
    title: 'The AI creative agency with a real studio behind it.',
    subtitle: 'AI commercials, UGC ads, music videos and films for brands, made by the CGI team behind campaigns for Netflix, Zalando and Miele.',
    project: 'below-statue-of-liberty',
    work: 'gucci-ai-fashion-film',
  },
  intro: {
    overline: 'what we do',
    heading: 'Generative AI for the ideas. Craft for the finish.',
    text: [
      'KOSMO® AI is the AI creative agency of KOSMO®, the studio behind mixed reality campaigns for Netflix, Zalando, Miele, Porsche and Renault. We use generative AI to explore more ideas, produce faster and make what a camera cannot film.',
      'Then our 3D artists, editors and art directors take over. Products stay exact, characters stay consistent and every film is finished to the standard of a brand campaign. That is the difference between an AI content agency and an AI tool.',
    ],
  },
  pillars: [
    { icon: 'bulb', title: 'Ideas first', text: 'We start from the concept people will share, then choose the tools. AI is how we make it, not what we sell.' },
    { icon: 'cube', title: 'Your product, exact', text: 'Products are built in 3D or taken from your packshots, never invented by a model.' },
    { icon: 'shield-check', title: 'Safe for brands', text: 'Commercial-use tools and assets, documented on every project, and platform disclosure rules followed.' },
    { icon: 'world', title: 'Every format', text: 'TV, CTV, social, e-commerce and out of home, from one production.' },
  ],
  compare: {
    overline: 'ai vs traditional production',
    heading: 'Same ambition. A different way to make it.',
    head: ['', 'Traditional production', 'KOSMO® AI'],
    rows: [
      { icon: 'calendar', feature: 'Locations and sets', old: 'Scouted, built and booked weeks ahead', new: 'Generated and built in the studio' },
      { icon: 'clock', feature: 'Changes', old: 'A reshoot, if the budget allows', new: 'A new version in days' },
      { icon: 'cube', feature: 'Product accuracy', old: 'Exact, on the day of the shoot', new: 'Exact, from your 3D or packshots' },
      { icon: 'share', feature: 'Formats and versions', old: 'Cut from what was filmed', new: 'Planned and produced for each channel' },
      { icon: 'eye', feature: 'What you can show', old: 'What a camera can capture', new: 'Anything the idea needs' },
    ],
  },
  faq: [
    { question: 'What is an AI creative agency?', answer: 'An agency that uses generative AI across concept, production and versioning, with people directing the ideas and finishing the work. KOSMO® AI combines AI with a CGI and post-production team, so the output is campaign quality.' },
    { question: 'How much does an AI commercial cost?', answer: 'It depends on length, the number of formats and versions, and how much of the product has to be built in 3D. We scope every project as a fixed price after a short call, so you know the full cost before production starts.' },
    { question: 'How long does a project take?', answer: 'Most projects run 3 to 4 weeks from an approved brief to delivery, with 2 rounds of revisions included.' },
    { question: 'Who owns the content you make?', answer: 'The usage rights are set in the contract before work starts, covering the channels, markets and duration you need. We only use tools and assets that allow commercial use.' },
    { question: 'Which brands have you worked with?', answer: 'KOSMO® has produced campaigns for Netflix, Miele, Zalando, Porsche, Renault, Uber Eats and Pringles, among others.' },
    { question: 'Where are you based?', answer: 'We work worldwide, with recent work in the United States, France, Japan and across Europe, and produce for US brands and agencies remotely.' },
  ],
};

/** Frise « How we work » (Process.astro) : mêmes délais que le studio (3 à 4 semaines, 2 tours de modifications). */
export const aiProcess = {
  overline: 'HOW WE WORK',
  heading: { demo: false, text: 'From a brief to films you can run.' },
  intro: {
    demo: false,
    text: 'You bring the brand, the product and the objective. We bring the idea, the AI production and the finish, with one producer from the first call to delivery.',
  },
  image: { src: '/images/process/briefing.avif', srcset: undefined, alt: '' },
  outcomeLabel: 'What you get',
  weeks: ['Week 01', 'Week 02', 'Week 03', 'Week 04', 'Live +'],
  timeline: { start: 'Approved brief', end: 'Delivered' },
  steps: [
    { demo: false, icon: 'file-text', label: 'Brief', col: 'col-start-1 col-span-2', when: 'Day 1', title: 'Brief', text: '', outcome: '' },
    { demo: false, icon: 'sparkles', label: 'Concept & frames', col: 'col-start-2 col-span-2', when: 'Week 1', title: 'Concept', text: '', outcome: '' },
    { demo: false, icon: 'cube', label: 'AI production & finishing', col: 'col-start-3 col-span-5', when: 'Weeks 2 to 3', title: 'Production', text: '', outcome: '' },
    { demo: false, icon: 'send', label: 'Delivery', col: 'col-start-8 col-span-2', when: 'Week 4', title: 'Delivery', text: '', outcome: '' },
    { demo: false, icon: 'share', label: 'Versions', col: 'col-start-9 col-span-2', when: 'Live', title: 'Versions', text: '', outcome: '' },
  ],
};

export const aiStats = {
  overline: 'in numbers',
  items: [
    { value: 150, suffix: '+', label: 'campaigns delivered', demo: false },
    { value: 14, label: 'countries', demo: false },
    { value: 3, suffix: 'B+', label: 'earned and owned media', demo: false },
    { value: 2, label: 'revision rounds included', demo: false },
  ],
};
