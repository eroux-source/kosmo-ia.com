/**
 * Tokens d'animation — pendant JS de src/styles/tokens.css.
 * Système « Cofounder » (22/10/2026) : entrées, titres, surtitres, lisières, lecteur du hero, nuage de tags…
 * relevés dans la maquette validée (docs/exports/redesign-cofounder/src/home.js). Le reste vient des
 * interactions Webflow IX3/IX2 de /reference (webflow.schunk.a25e2b58531e9569.js).
 */
export const motion = {
  /** [data-fade] : fondu + montée de 16 px, en lot (maquette : ScrollTrigger.batch, top 92 %) */
  fade: {
    y: 16,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    start: 'top 92%',
  },
  /**
   * i-62c7a58e / i-5b9a2ec6 / i-7a6d7d7d — [GSAP-stagger-text="trigger"], SplitText (words).
   * Webflow enregistre trois fois l'interaction (départs 120 %, 120 %, 80 %) :
   * la version visible est celle qui rejoue à « top 80% ».
   */
  /** Titres en deux tons : les mots montent (40 %) en sortant d'un flou de 6 px */
  staggerText: {
    yPercent: 40,
    blur: 'blur(6px)',
    clear: 'blur(0px)',
    duration: 0.9,
    stagger: 0.045,
    ease: 'power3.out',
    start: 'top 88%',
  },
  /** Filet du surtitre : se trace de gauche à droite */
  eyebrow: {
    duration: 1.2,
    ease: 'power3.inOut',
    start: 'top 90%',
  },
  /** Lisières en pixels tramés (src/scripts/dither.ts) : hauteurs en fraction de la lisière */
  dither: {
    from: 0.15,
    duration: 1.1,
    steps: 8,
    start: 'top 95%',
    base: 0.35,
    wobble: 0.12,
    min: 0.12,
    max: 0.7,
    tuftChance: 0.05,
    tuft: 0.25,
    strays: 7,
    strayReach: 0.35,
    strayChance: 0.6,
    acidChance: 0.18,
    /** voisine plus sombre que ce seuil de luminance = pas de lisière */
    darkThreshold: 0.35,
  },
  /** Nav fixe : passe en papier quand le bas du hero arrive à 80 px du haut */
  nav: { solidStart: 'bottom 80px', dropdownClose: 160 },
  /** Hero : l'image se pose (scale 1.08 → 1) puis glisse au défilement */
  hero: { zoomDuration: 2.2, zoomEase: 'power3.out', parallax: 12 },
  /** i-a661b10a — survol .button_slide */
  buttonSlide: {
    duration: 0.3,
    ease: 'power2.out',
    arrowRotation: -45,
  },
  /** i-e63f0491 — clic .faq5_accordion-trigger */
  faq: {
    duration: 0.5,
    ease: 'power1.out',
    borderDuration: 0.05,
    lineRotation: 90,
  },
  /** IX2 « Nav Dropdown Open / Close » */
  navDropdown: {
    duration: 0.3,
    easeOpen: 'power1.out',
    easeClose: 'power1.in',
    shift: -12,
    arrowRotation: 180,
    /** Bandes photo du menu Services : entrée en cascade à l'ouverture (prototype nav-dropdown v01) */
    stripShift: 16,
    stripStagger: 0.05,
    stripDuration: 0.5,
    stripEase: 'expo.out',
  },
  /** Webflow nav (data-duration="400", data-easing="ease") */
  navMenu: {
    duration: 0.4,
    ease: 'power1.inOut',
  },
  /** Script « text-wobble » du logo footer (filtre SVG) */
  wobble: {
    baseFrequency: '0.015;0.03;0.015',
    turbulenceDuration: '2.5s',
    displacement: '0;35;0',
    displacementDuration: '0.6s',
    resetDelay: 650,
  },
  /**
   * [data-tilt] — vidéo du bloc concept gratuit : entre en fondu + glissement (valeurs du fade) et se pose
   * en biais ; se redresse au survol (durée/easing du survol des boutons). Rotation relevée sur les cartes
   * industries de la référence (--industries-card-2 : rotate(-5deg)).
   */
  tilt: {
    rotation: -5,
    y: '2rem',
    duration: 0.5,
    ease: 'power1.inOut',
    start: 'top bottom',
    hoverDuration: 0.3,
    hoverEase: 'power2.out',
  },
  /** Swiper hero4 / gallery1 / process3 */
  swiper: {
    speed: 600,
    galleryGap: 20,
    galleryMinScale: 0.65,
    galleryMaxScale: 1,
    galleryInfluence: 800,
    galleryMomentumRatio: 0.5,
    processGap: 24,
  },
  /** Flowbase « Carousel Ticker » : durée d'un tour (fb-carousel-speed), délai, pause au survol */
  ticker: {
    partners: { duration: 8, delay: 0.5, pauseOnHover: true },
    team: { duration: 28, delay: 0, pauseOnHover: false },
  },
  /** IX3 t-7b2a5b5d — survol d'une carte équipe */
  teamCard: {
    duration: 0.5,
    imageScale: 1.05,
  },
  /** Compteurs de la bande de chiffres */
  counter: {
    duration: 1.6,
    ease: 'power3.out',
    start: 'top 90%',
  },
  /** Timbres du modèle de campagne : inclinaison 3D qui suit le pointeur */
  ticket: { perspective: 900, rotateY: 16, rotateX: 12, scale: 1.03, duration: 0.5, ease: 'power3.out', holoCell: 8, holoTile: 512 },
  /** Grande image du journal : même inclinaison que les timbres, plus douce (image plus grande) */
  featuredTilt: { perspective: 1400, rotateY: 8, rotateX: 6, scale: 1.015, duration: 0.6, ease: 'power3.out' },
  /**
   * Chiffres : tuiles vidéo tramées (recette « Prisma », 21st.dev/community/ascii), en gris sur le fond du bloc.
   * Cellule de 2 px, contraste, contours, scintillement, grain, lignes, vignette ; 15 images / s.
   */
  prisma: { cell: 2, coverage: 0.96, contrast: 1.4, edge: 0.4, glitch: 0.2, flicker: 0.88, grain: 0.25, scan: 0.22, vignette: 0.55, fps: 15, toneFrom: 0.28, toneRange: 0.5, offShare: 0.35 },
  /** Carte du monde en points : loupe noire autour du pointeur, traînée courte, apparition de gauche à droite */
  worldMap: { rest: 0.5, lit: 0.95, radius: 9, rise: 0.3, decay: 0.08, restAlpha: 0.22, introDuration: 1.6, introEase: 'power2.inOut', start: 'top 80%', pinDuration: 0.5, pinStagger: 0.06, pinEase: 'back.out(2)', pinDelay: 0.9 },
  /** Industries : nuage de tags magnétiques (annnimate, src/scripts/magnetic-tag-cloud.ts) */
  tagCloud: { gap: 8, maxRows: 3, hoverRadius: 90, hoverStrength: 1, spin: 1, repelRadius: 110, repelStrength: 60, stiffness: 180, damping: 0.5, throwStrength: 1 },
  /** Cartes projet : l'affiche du film se charge quand la carte arrive à cette distance de l'écran. */
  hoverVideo: { posterMargin: '800px 0px' },
  /** Glissé au doigt (témoignages) : distance horizontale minimale en px pour changer de carte. */
  swipe: { threshold: 40 },
  /** Logos clients : même surface pour tous (largeur × hauteur), bornée */
  logos: { area: 760, maxWidth: 96, maxHeight: 34, stagger: 0.025, y: 10, duration: 0.6 },
  /** Bande de logos sur mobile (≤ 479 px, 4 colonnes de 75 px) : surface et bornes réduites pour tenir dans la cellule. */
  logosMobile: { area: 600, maxWidth: 72, maxHeight: 28 },
  /**
   * Avant / après « Compare » (SparkCompare.astro), valeurs du composant d'origine (Aceternity) et de son SparklesCore
   * (tsparticles) : position de départ et de retour de la ligne, particules pour 400 × 400 px, rayons (px), vitesse de
   * déplacement (px par image à 60 i/s, la moitié de la vitesse tsparticles 0,1–1), scintillement (variation d'opacité
   * maximale par image, vitesse 4 de tsparticles), opacité min / max, pas clavier.
   */
  sparkCompare: { start: 0.5, density: 1200, densityArea: 400 * 400, size: { min: 0.4, max: 1 }, speed: { min: 0.05, max: 0.5 }, twinkle: 0.04, opacity: { min: 0.1, max: 1 }, step: 0.02, page: 0.1 },
  /**
   * Comparateur lenticulaire (LenticularCompare.astro), valeurs du composant d'origine : nombre de lamelles, retard de
   * rotation d'une lamelle à l'autre, ombrage des faces, ressort, zones d'arrivée où le film entier reprend la main.
   */
  lenticular: {
    facets: 24,
    facetsMobile: 14,
    mobileBreakpoint: 600,
    overlap: 0.035,
    stagger: 0.16,
    shadeMin: 0.73,
    spring: { stiffness: 265, damping: 34, mass: 0.72 },
    snap: 0.012,
    hide: 0.002,
    start: 0,
    fps: 30,
  },
  /**
   * Effet LED des photos des cartes services (Formats.astro, src/scripts/led-screen.ts) : recette « Vibrant Pulse
   * Glow » (21st.dev/community/ascii, rendu « lego ») en version très légère. Cellule en px CSS, opacité du voile de
   * briques sur la photo, contraste, plot (rayon / cellule), éclaircissement du plot, reflet, ombre des joints,
   * vignette, halo (bloom), pulsation : anneau qui part du centre (période en s, largeur et force de l'anneau).
   */
  led: { cell: 5, opacity: 0.32, contrast: 1.25, stud: 0.3, studLift: 1.14, highlight: 0.35, joint: 0.55, vignette: 0.3, bloom: 0.25, pulsePeriod: 2.4, pulseWidth: 0.22, pulse: 0.6, fps: 30 },
  /** Flowbase before/after : position de départ (%) */
  compare: {
    start: 50,
  },
  /**
   * KOSMO® PLAY (/play, wireframe du 19/10/2026). Pas d'équivalent IX3 : entrées calées sur le fade (0.5s,
   * power1.inOut) et les compteurs (power2.out), le reste règle le mini-jeu du hero.
   */
  play: {
    /** Mini-jeu « attrape les cubes » (src/scripts/play-game.ts). Unités : pixels logiques du canvas, secondes. */
    game: {
      width: 90,
      height: 160,
      duration: 20,
      spawnStart: 0.8,
      spawnEnd: 0.32,
      fallStart: 42,
      fallEnd: 100,
      trapShare: 0.26,
      bonusShare: 0.07,
      points: { cube: 1, star: 3, trap: -2 },
      keySpeed: 120,
      follow: 0.35,
      dotSpacing: 10,
      dotSpeed: 10,
      burstCount: 8,
      burstLife: 0.45,
      burstSpeed: 45,
      hitFlash: 0.15,
    },
    /** Frise « format classique / jeu de marque » : les cases s'allument une à une */
    track: { duration: 0.35, stagger: 0.12, ease: 'power1.inOut', start: 'top 75%' },
    /** Schéma de diffusion : pointillés qui défilent des canaux vers le jeu, puis vers le CRM */
    flow: { dash: '2 6', cycle: 8, duration: 0.6 },
    /** Process en niveaux : la barre se remplit pendant qu'elle traverse l'écran (de 85 % à 35 % de la hauteur) */
    progress: { start: 'top 85%', end: 'top 35%' },
    /** Tableau de bord : barres et entonnoir */
    bars: { duration: 1.1, stagger: 0.04, ease: 'power2.out', start: 'top 80%' },
    /** Sprites qui flottent en deux temps (pas de pixels, comme un sprite de jeu) */
    bob: { y: '-0.25rem', duration: 0.5, ease: 'steps(1)' },
    /** Formulaire : passage automatique à l'étape suivante après un choix unique, cases de la barre */
    form: { advanceDelay: 0.35, cells: 20, flash: 0.6 },
  },
} as const;
