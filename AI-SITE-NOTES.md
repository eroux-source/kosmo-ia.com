# KOSMO® AI — notes de lancement (02/11/2026)

## Ce qui est fait
- Accueil (AI creative agency) + 8 pages services (TV, photoshoot, entertainment et automotive retirés le 02/11), mots-clés du plan Semrush US.
- /work : les 65 films de projects.json (aucun DOOH), une page par film (/work/<slug>).
- /contact avec formulaire de brief (form `ai-brief` → /api/lead → HubSpot, champ « Service » ajouté au résumé du lead).
- JSON-LD : Service, FAQPage, BreadcrumbList, VideoObject. Sitemap, llms.txt.
- Charte KOSMO® (tokens, composants, animations) reprise telle quelle ; `npm run check:tokens` passe.

## À valider (rédigé sans validation)
- **Domaine** : `kosmo-ia.com` (apex, sans www), d'après le nom du repo (astro.config.mjs + src/lib/seo.ts).
- **Nom** : « KOSMO® AI » dans les titres.
- **Prix** : aucun chiffre affiché. FAQ : « fixed price after a short call » ; contact : « A fixed price before production starts ».
  Fourchettes de budget du formulaire : Under $10k → $100k and above (src/lib/lead.ts).
- **Délais** : 3 à 4 semaines + 2 tours de modifications (faits confirmés du studio, appliqués à l'IA).
- **Droits / conformité** : « commercial-use tools and assets, documented on every project », droits d'usage fixés au contrat,
  propriété du personnage IA par la marque « usual setup ».
- **Méthode** : « IA + équipe 3D / post-production », équipe US à distance (« Worldwide, working with US brands remotely »).
- **Films** : ce sont des films CGI / réalité mixte du studio. Le texte dit « films we produced… in CGI, mixed reality and AI »
  et ne les présente jamais comme faits à l'IA. Seuls Disney Là-Haut et Lilo & Stitch (concepts de l'agence) sont IA.
- **Analytics** : GA4, Contentsquare et RB2B ne sont plus chargés par défaut (identifiants du site principal). À renseigner
  dans les variables d'environnement Vercel (RB2B utile pour un site US).

## Médias manquants (aucun film du studio ne correspond vraiment)
- AI music videos, AI explainer videos, AI influencers, AI UGC ads : films de remplacement pris dans le
  portfolio. Idéalement, de vraies productions IA de KOSMO® pour ces pages.
- Les vidéos et logos hébergés sur framer-bg-videos.b-cdn.net / framerusercontent.com ne sont pas copiés en local.

## Pas encore fait
- Article « Best AI commercials » (cluster 4 000+ recherches/mois) et les 4 articles GEO.
- Nettoyage de public/ (assets 3DOOH inutilisés, ~60 Mo).

## Productions IA (02/11/2026)
- 17 références (Téléchargements d'Eugène, ~/Downloads/kosmo-ia-web) encodées en 720p sans son : public/video/ai,
  affiches public/images/ai, données src/data/ai-work.ts, pages /work/ai/<slug>.
- **À confirmer** : `concept: true` affiche « AI concept » (film fait à l'initiative de KOSMO®, sans commande) pour Gucci,
  Alaïa, Zara, Oakley, Lanvin, Balenciaga, Loewe, Polène et Etam ; « AI production » pour TUI, Memoria et All Quiet.
  Passer `concept` à false pour chaque vraie commande.
- Ambassadeurs IA (page AI influencers, hero UGC et influencers) : générés sur Higgsfield avec le logo KOSMO®, hébergés
  sur le stockage Higgsfield du compte (URLs dans ai-work.ts). À rapatrier dans public/images pour ne plus en dépendre.

## 02/11/2026 : accent orange, blog, cohérence IA

- Accent du site : `--kosmo-acid` passe au orange KOSMO® `#FF5310` (le citron reste celui de kosmocgi.com). Le liseré d'erreur des champs est aussi orange : à surveiller.
- Blog `/blog` : 10 articles (src/content/posts, brief de rédaction dans docs/ARTICLE-BRIEF.md), auteur Eugène Roux (Person JSON-LD), FAQPage tirée de « ## FAQ », sources en fin d'article. À relire avant diffusion, en particulier les chiffres cités.
- Les films CGI / réalité mixte du studio (/work/<slug>, hors /work/ai) restent visibles dans /work mais sont en `noindex, follow` et hors sitemap, pour garder kosmo-ia.com centré sur l'IA (ils sont indexés sur kosmocgi.com). Décision à valider.
- /contact : textes du brief orientés IA, films IA, FAQ « après le brief » + ContactPage / FAQPage. Politique de confidentialité : formulaire de brief IA, outils d'analyse réellement actifs.
