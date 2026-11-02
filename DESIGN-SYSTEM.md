# KOSMO® — Design system « Cofounder » (22/10/2026)

Source de vérité pour tout le site. Relevé sur la maquette de la home validée par Mehdi le 21/10/2026
(`docs/exports/redesign-cofounder/kosmo-home-cofounder_v03_2026-10-21.html`, sources dans `src/`) : le système de
cofounder.co habillé aux couleurs et polices KOSMO®. Les valeurs vivent dans `src/styles/tokens.css` (CSS) et
`src/scripts/motion-tokens.ts` (GSAP) ; ce fichier décrit les règles. Ancienne charte (export Webflow, 27/09/2026) :
voir l'historique git.

## Principes

1. **À plat.** Ni ombre, ni relief, ni dégradé décoratif, ni flou d'arrière-plan. Une carte se détache par sa couleur
   et un liseré intérieur de 1 px (`--card-ring`), jamais par une ombre.
2. **Rayons : 4 px maximum.** 4 px pour un bloc (bouton, carte, panneau), **2 px pour un bloc posé dans un bloc**
   (image dans une carte, étiquette, pastille, onglet, bloc chevron du bouton). Le rond (`rounded-pill`) est réservé
   aux points (repères de carte, puces).
3. **Titres en capitales et en deux tons.** Graisse 800, interlignage serré (1 à 1,05), lettres resserrées (-0,03 em).
   La seconde partie du titre passe à 50 % de la couleur du texte (`<em>`, voir TwoTone).
4. **Étiquettes en Inconsolata.** Surtitres, légendes, chiffres de carte : mono, capitales, 12 px, -0,025 em.
5. **Papier, noir, acide.** Fond de page papier, cartes blanches ; sections sombres en noir KOSMO® avec une trame de
   points ; l'acide sert d'accent (bouton du footer, survols, chiffres clés), jamais de fond de section.

## Couleurs

| Token | Valeur | Usage |
|---|---|---|
| `--kosmo-paper` (`bg-paper`) | `#F1F2F1` | Fond de page et des sections claires |
| `--kosmo-white` (`bg-white`) | `#FFFFFF` | Cartes, boutons clairs, segments de la nav |
| `--kosmo-black` (`bg-black`) | `#1A1A1A` | Texte, sections sombres, boutons principaux |
| `--surface-dark` (`bg-surface-dark`) | `#222222` | Bloc posé sur un fond noir (footer, cartes sombres) |
| `--kosmo-acid` (`bg-acid`) | `#D6F10E` | Accent : bouton acide, survols, segment des chiffres, icônes |
| `--grey-400` / `--grey-200` | `#B0B0B0` / `#E7E7E7` | Gris neutres (rares) |
| `--kosmo-orange` | `#FF5310` | Accent ponctuel hérité (rare) |
| `--ink-soft` (`text-ink-soft`) | noir 50 % | Texte secondaire sur clair, second ton des titres |
| `--ink-faint` | noir 34 % | Texte tertiaire |
| `--line` / `--line-strong` (`border-line`) | noir 8 % / 14 % | Liserés de cartes, filets |
| `--on-dark` / `--on-dark-soft` | blanc 92 % / 55 % | Texte sur fond sombre |
| `--line-dark` (`border-line-dark`) | blanc 14 % | Filets sur fond sombre |

**Palette des étiquettes et onglets** (palette de référence de Mehdi, **hors charte KOSMO®, à valider**, décision
`tag-palette`) : `--tag-orange #FF340C`, `--tag-red #E0070F`, `--tag-pink #F03172`, `--tag-rose #E990A2`,
`--tag-amber #FFAE00`, `--tag-olive #CAC307`, `--tag-green #0F4A42`, `--tag-sky #98B3EA`, `--tag-cream #F9F3DB`,
`--tag-blue #273287`, `--tag-brown #441B07` (les trois sombres prennent un texte crème). Utilisée seulement par le
nuage Industries et les onglets du dossier de la home.

Contexte sombre : l'utilitaire `tone-dark` (posé par `Section tone="dark"`) inverse `--label-color`, `--body-soft`,
`--eyebrow-track` et `--line`. Dans un composant, écrire `text-(--label-color)` / `text-(--body-soft)` pour un texte
secondaire qui suit le fond.

## Typographie

Polices : **Hanken Grotesk** (400–800) et **Inconsolata** (400/700), rien d'autre. Corps : 15 px, graisse 500,
interlignage 1,4, +0,01 em.

| Utilitaire | Taille (desktop / ≤ 991 / ≤ 767) | Style | Usage |
|---|---|---|---|
| `display-heading` | 56 / 44 / 36 px | 800, capitales, 1,0 | H1 du hero |
| `heading-h1` | 56 / 44 / 36 px | 800, capitales, 1,0 | H1 de page mis en avant |
| `heading-h2` | 48 / 40 / 32 px | 800, capitales | Titre de page fort (contact, deck) |
| `heading-h3` | 40 / 32 / 28 px | 800, capitales, 1,05 | **Titre de section** (H2 de la maquette) et H1 des pages intérieures |
| `heading-h4` | 32 / 28 / 24 px | 800, capitales | Sous-titre fort |
| `heading-h5` | 24 / 22 / 20 px | 800, capitales, 1,1 | Titre de bloc (appel sous le dossier) |
| `heading-h6` | 20 / 18 px | 500, casse normale, -0,02 em | **Titre de carte** |
| `heading-feature` | 22 px | 800, capitales | Bloc image du menu Services |
| `text-body-large` / `-medium` / `-small` | 17 / 15 / 14 px | 1,4 | Paragraphes |
| `text-caption` | 13 px | | Liens du footer, descriptions du menu |
| `text-tagline` | 12 px | Inconsolata capitales, -0,025 em | Surtitres, étiquettes |
| `text-mono-body` | 14 px | Inconsolata | Texte des timbres |
| `text-tiny` | 11 px | | Étiquettes de la carte, puces |

**Titres en deux tons** : `<h2 class="heading-h3"><TwoTone text={…} /></h2>`. La seconde partie est ce qui suit la
dernière ponctuation intérieure (« One idea, *three layers of reach.* ») ; `soft="…"` la fixe à la main quand le
titre n'en a pas (« Unreal campaigns *people stop for.* »). Le traducteur voit `One idea, <t1>three layers of
reach.</t1>` et place le second ton dans chaque langue.

## Layout

- Container `max-w-page` = **1052 px**, gouttière **20 px** (`px-(--gutter)`) à toutes les tailles.
- Sections : `Section spacing="md"` = 56 px en haut et en bas (deux sections = 112 px), `lg` = 112 px ; tablette 44 / 88 px.
- En-tête de section : `<Eyebrow>` puis, 28 px plus bas (`mt-(--head-gap)`), une grille 2 colonnes : titre à
  gauche, intro (420 px max, `text-(--body-soft)`) calée en bas à droite, ou un bouton calé en haut à droite.
- Breakpoints desktop-first : `max-lg:` ≤ 991 px, `max-md:` ≤ 767 px, `max-sm:` ≤ 479 px.

## Composants

- **Bouton « Get started »** (`Button.astro`) : 41 px de haut, rayon 4 px, texte 14 px en casse normale (première
  lettre en capitale), bloc chevron de 33 px à droite (retrait 4 px, rayon 2 px, couleur du texte à 15 %). Au survol
  le bloc s'élargit sur tout le bouton et le texte s'efface ; au clic il se tasse. Variantes : `dark` (principal sur
  clair), `light` (blanc + liseré), `acid`, `outline` (verre clair sur fond sombre), `outline-black` (= light).
  `go={false}` : sans chevron ; `icon` : icône avant le texte ; `verbatim` : libellé tel quel (email).
- **Surtitre** (`Eyebrow.astro`) : étiquette mono + filet qui se trace jusqu'au bord droit.
- **Carte** : utilitaire `card` (blanc, rayon 4 px, liseré 1 px) ; `card-dark` sur fond noir. Carte « fenêtre » :
  6 px de marge (`p-(--card-pad)`) autour du média (rayon 2 px). Survol : liseré acide (`shadow-(--card-ring-acid)`)
  ou montée de 2 à 4 px.
- **Étiquette** : utilitaire `chip` (mono 11 px capitales, 22 px, rayon 2 px).
- **Section sombre** (`Section tone="dark"`) : noir + trame « Dark Dot Matrix » (`bg-dot-matrix`, deux trames de
  points décalées au pas de 10 px) et **lisières en pixels tramés** (`Dither.astro` + `src/scripts/dither.ts`) vers les
  voisines claires : colonnes de pixels de 2 px de hauteur aléatoire, quelques pixels isolés dont certains acides,
  qui poussent en huit paliers à l'entrée. Lisière retirée automatiquement si la voisine est sombre.
- **Nav** (`Nav.astro`) : fixe ; transparente sur un hero sombre (logo blanc, segments vitrés blancs à 14 %), papier
  68 px une fois le hero passé ou d'emblée sur les pages intérieures. Segment de liens (menu Services déroulant au
  survol : carte blanche 600 px, 4 services à pastille d'icône qui passe en acide, bloc image), segment langue,
  Book a call (clair), Contact (noir). ≤ 991 px : burger, menu papier sous la barre.
- **Hero** (`Hero.astro`) : image plein cadre sous un voile noir à gauche et en bas ; badge, titre deux tons et
  sous-titre en bas à gauche ; à droite le mini lecteur du showreel (16:9, 440 px, son + agrandir) au-dessus des deux
  CTA (Contact clair, secondaire noir). L'image se pose (zoom 1,08 → 1) puis glisse au défilement.
- **Footer** (`Footer.astro`) : sur la trame de points, un bloc `#222` (colonnes de liens + accroche + bouton acide),
  puis une bande de points acides tramés qui dérive lentement ; le logo KOSMO® est le vide dans les points, 5 % caché
  sous le bas du bloc ; projecteur qui suit la souris. Barre du bas : mentions, langues, réseaux, liens légaux.
- **Contact** : bandeau « Got an idea? » entre deux filets (email et téléphone en boutons verre), puis trois cartes
  blanches (pastille d'icône acide 32 px, titre de carte, texte, bouton noir). Le footer suit à 24 px.
- **Carte projet** (`MosaicCard.astro`) : le film au format natif (coins 4 px) lu au survol, le logo de la marque en
  gris dans une étiquette blanche collée au bord droit, un peu sous le haut (même hauteur pour tous les logos ; sans
  logo, le nom en capitales). Titre, ville et format n'apparaissent qu'au survol. Pas de nom de marque au-dessus, pas
  de pastille chiffre. Mosaïque de /work (d'après whycgi.media/projects) : 4 colonnes (2 sur mobile), 16:9 sur deux
  colonnes, 9:16 et 1:1 sur une, chaque film à son format exact, trous comblés automatiquement (`src/scripts/mosaic.ts`).
- **Frise « How we work »** (`Process.astro`) : à même le fond, une colonne par semaine, une barre blanche par étape
  (icône Angular Icons, angularicons.com, + nom) ; l'étape la plus longue en noir avec le liseré animé (`beam` +
  `beam-halo` : faisceau acide / palette des étiquettes qui fait le tour du bord, halo flouté derrière, 3,3 s par tour).
- **Petits blocs CTA noirs** (bloc concept gratuit `ConceptCta`, carte de la FAQ) : grille fine (carrés de 12 px, lignes
  blanches à 5 %) qui s'efface en dégradé radial depuis le coin du faisceau ; faisceau d'1 px posé exactement sur les
  lignes, en escalier, balayé en diagonale toutes les 3,8 s avec des changements de vitesse, aux couleurs du composant
  d'origine (cyan, violet, mauve : hors charte, demandé par Mehdi, uniquement ici). `GridBeam.astro`, d'après
  « Background Grid Beam » ; en haut à droite, ou au milieu quand une image occupe la droite du bloc.
- **Cartes à coin coupé** (`.service-card`, global.css) : services anamorphiques (`Formats.astro`) et les deux
  disciplines côte à côte (`Services.astro`) : titre en capitales, flèche qui pivote vers le coin au survol, texte,
  image pleine largeur en bas, légère montée au survol ; « you are here » en étiquette mono à côté de la flèche.
- **Témoignages** : éventail de cartes à coin coupé, bordure « spotlight » de 3 px qui s'allume en dégradé de teinte
  sous le pointeur ; la carte centrale est noire.
- **Chiffres** (`Stats.astro`) : tuiles de 212 px (libellé en haut, chiffre 64 px en bas) papier / acide / noir ;
  sur la home, des films tramés en gris (recette « Prisma ») s'intercalent.
- **Industries** : nuage de tags magnétiques (script officiel annnimate, pastilles de la palette + images de projets).
- **Modèle de campagne** (home) : dossier noir à onglets qui range des timbres à bords perforés (inclinaison 3D et
  reflet holo au survol), puis un appel discret (photo de Mehdi, une phrase, deux boutons).

## Mouvement (`src/scripts/motion-tokens.ts`)

| Attribut | Effet |
|---|---|
| `data-fade="trigger"` / `"target"` | fondu + montée de 16 px, 0,8 s, power3.out, cascade 0,08 s |
| `data-stagger-text` | mots qui montent (40 %) en sortant d'un flou de 6 px, 0,9 s, cascade 0,045 s |
| `data-eyebrow` | filet du surtitre 0 → 100 %, 1,2 s, power3.inOut |
| `data-dither` | lisière tramée qui pousse en 8 paliers (1,1 s) |
| Survols | 0,2 à 0,5 s, `--ease-kosmo` (cubic-bezier(.22, 1, .36, 1)) |

`prefers-reduced-motion` : tout est posé à l'état final.

## Points ouverts (à valider par Mehdi)

- Palette des étiquettes et onglets hors charte (ci-dessus).
- Photo de Mehdi de l'appel sous le dossier : recadrage de `public/images/about/mehdi.jpg`.
- Liens des réseaux sociaux du footer : ceux de `SITE.social` (src/lib/seo.ts), à vérifier.
