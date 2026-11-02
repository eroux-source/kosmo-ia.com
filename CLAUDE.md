# KOSMO® AI — règles du projet

Site KOSMO® AI (agence créative IA, marché US) en Astro + Tailwind CSS v4, déployé sur Vercel. Copie du site
kosmo-site (même charte, mêmes composants) recentrée sur l'IA. Contenu : `src/data/ai.ts` ; pages : `src/pages/[service].astro`,
`index`, `work`, `contact`. Points à valider : `AI-SITE-NOTES.md`.
`/reference` (dans kosmo-site) = export Webflow du site publié. `DESIGN-SYSTEM.md` = charte, source de vérité. `docs/AUDIT-3DOOH.md` = cahier des charges.

## Règles non négociables

1. **Tokens uniquement.** Toute valeur de style (couleur, taille, espacement, rayon, ombre, durée, easing)
   vit dans `src/styles/tokens.css` (CSS) ou `src/scripts/motion-tokens.ts` (GSAP/Swiper). Nulle part ailleurs.
   - Dans le markup : utilitaires du thème (`bg-acid`, `rounded-default`, `heading-h3`, `text-tagline`, `max-lg:`…)
     ou référence à un token (`h-(--button-height)`, `bg-(image:--texture-noise)`).
   - Interdits : hex/rgb/hsl, `color-mix()` hors tokens, valeurs arbitraires (`h-[42px]`), attribut `style`,
     palettes Tailwind par défaut (elles sont effacées du thème et ne compilent pas).
   - Une valeur brute nécessaire hors CSS (meta theme-color…) se lit avec `tokenColor()` de `src/lib/seo.ts`.
   - `npm run check:tokens` doit passer avant tout commit.
2. **Composants existants uniquement.** Une page = un assemblage de `src/components`. Avant de créer
   un composant, vérifier qu'aucun existant (ou une prop) ne couvre le besoin. Un nouveau composant ne peut
   combiner que des patterns déjà présents dans `/reference`.
3. **Ne jamais inventer de style.** Pas de nouvelle couleur, ombre, rayon, taille ou animation. Si la charte
   ne couvre pas un cas, relever la valeur dans `/reference` et l'ajouter à `tokens.css` (section B, avec la
   classe Webflow d'origine en commentaire). En cas de conflit charte / référence, la charte gagne.
4. **Contenu.** Toute donnée de contenu (cas, témoignages, chiffres, FAQ, prix) vit dans `src/content` ou `src/data`.
   La règle « DÉMO » (envelopper le texte inventé dans `<Demo>`, marquer les preuves inventées) est supprimée
   (décision de Mehdi, 2026-10-05) : plus besoin de `<Demo>` ni du champ `demo` pour le nouveau contenu.
   - Faits confirmés (validés par Mehdi le 2026-10-05) : contact@kosmocgi.com, (+971) 5 26 71 38 90 ;
     concept gratuit proposé en CTA secondaire (le CTA principal est Contact) ; pas de prix fixe par asset anamorphique
     (dépend du resizing et du nombre d'écrans), projets idéaux autour de 40 000 € ; KOSMO peut faire l'achat média
     (contrôle du budget, écrans choisis pour la créa).
   - Entités juridiques (KSM F.Z.E., KOSMO CGI SAS, SIREN 930 375 902) et ancrage Paris / Dubaï : uniquement là où
     c'est obligatoire (mentions légales, données structurées légales). KOSMO se présente comme internationale.
   - **Plus valables, à ne plus présenter comme des faits :** « visuel sous 72h + call de 15 min », « à partir de
     15 000 $ par asset », « régies partenaires JCDecaux / Cityz Media / Phi advertising / iDOOH ». « 3B+ earned and
     owned media » reste utilisable mais date de l'époque FOOH : ne pas en faire l'argument principal.
   - Toute décision prise sans validation va dans `src/data/decisions.ts`. La page `/todo` (noindex) liste
     les décisions, les placeholders et les variables d'environnement.
5. **Polices :** Hanken Grotesk (400–800) et Inconsolata (400/700) uniquement.

6. **Anglais uniquement (US).** Pas de traduction ni de sélecteur de langue sur ce site.

## Où trouver quoi

| Besoin | Fichier |
|---|---|
| Tokens CSS + thème Tailwind (`@theme`) | `src/styles/tokens.css` |
| Styles typographiques (`heading-h1…h6`, `display-heading`, `text-tagline`…) | `src/styles/typography.css` |
| Tokens d'animation (valeurs IX3 Webflow) | `src/scripts/motion-tokens.ts` |
| Textes et données | `src/data/*.ts` (site, 3dooh, faq, legal, decisions, assets-needed, env-registry…) |
| Cas et articles (collections) | `src/content/cases/*.md`, `src/content/posts/*.md`, schémas dans `src/content.config.ts` |
| Leads | `src/lib/lead.ts` (modèle), `src/lib/hubspot.ts`, `src/pages/api/lead.ts`, `src/scripts/lead-form.ts` |
| SEO (meta, JSON-LD) | `src/lib/seo.ts`, `src/layouts/BaseLayout.astro` |
| Env, démo, checklist | `src/lib/env.ts`, `src/lib/demo.ts`, `src/lib/todo.ts` → `/todo` |
| Primitives UI | `src/components/ui/` (`Button`, `Icon`, `Noise`, `Section`, `Eyebrow`, `Demo`, `Placeholder`, `FormField`, `SelectField`, `FreeConceptForm`, `BookingEmbed`, `WhatsAppButton`, `MobileCtaBar`, `Analytics`, `BeforeAfter`, `ComparisonTable`) |
| Nav / footer / pages légales | `src/components/layout/` |
| Sections | `src/components/sections/` |
| Langues : config, slugs, moteur de traduction, dictionnaires | `src/i18n/` (`config.ts`, `slugs.ts`, `routes.ts`, `engine.mjs`, `dict/<langue>/*.json`) |
| Redirection automatique par langue (IP + navigateur) | `scripts/vercel-i18n-middleware.mjs` (généré au build), `src/components/ui/LangSwitch.astro` |
| Catalogue des composants | `/styleguide` |

## Breakpoints (desktop-first, comme Webflow)

`max-lg:` ≤ 991px (tablette) · `max-md:` ≤ 767px (mobile paysage) · `max-sm:` ≤ 479px (mobile).
Écrire le style desktop sans préfixe, puis les surcharges `max-*`.

## Animations (attributs, voir `src/scripts/animations.ts`)

| Attribut | Effet (équivalent IX3) |
|---|---|
| `data-fade="trigger"` sur le parent, `data-fade="target"` sur les enfants | fondu + glissement 2rem, stagger 0.25s |
| `data-stagger-text` | SplitText par mots, fondu + glissement 1.25rem |
| `data-eyebrow="trigger"` / `"target"` | barre de l'eyebrow 0 → 100 % (inclus dans `<Eyebrow>`) |
| `data-button-slide` | survol des boutons « slide » (inclus dans `<Button>`) |
| `video[data-lazy][data-src]` | chargement différé + pause hors écran (`src/scripts/video-lazy.ts`) |

## Leads, attribution, mesure

- Formulaires : `<form data-lead-form="…" data-success="/thank-you?form=…">`, étapes `[data-step]`, erreurs `[data-error-for]`,
  honeypot `website`. L'attribution (UTM, `?company=`) est capturée par `src/scripts/attribution.ts`.
- `?company=Brand` personnalise le hero (`[data-personalize]`) et pré-remplit `input[name=company]`.
- Conversions : `window.kosmoTrack(name)`, ou `data-track-view` / `data-track-click` dans le HTML.

## Commandes

```bash
npm run dev            # http://localhost:4321/3dooh (et /fr/3dooh, /de/3dooh, /nl/3dooh)
npm run build          # sortie Vercel dans .vercel/output
npm run check:tokens
npm run i18n:extract   # après build : textes sans traduction → .i18n/missing-<langue>.json
npm run check:i18n     # après build : traductions complètes + SEO des pages /fr, /de, /nl
npm run shots docs/screenshots/<nom> /3dooh /work   # captures 1440 + 390 et rapport (Chrome local)
node .claude/serve-reference.mjs   # référence Webflow sur http://localhost:4400
```
