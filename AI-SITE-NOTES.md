# KOSMO® AI — notes de lancement (02/11/2026)

## Ce qui est fait
- Accueil (AI creative agency) + 12 pages services, mots-clés du plan Semrush US.
- /work : les 65 films de projects.json (aucun DOOH), une page par film (/work/<slug>).
- /contact avec formulaire de brief (form `ai-brief` → /api/lead → HubSpot, champ « Service » ajouté au résumé du lead).
- JSON-LD : Service, FAQPage, BreadcrumbList, VideoObject. Sitemap, llms.txt.
- Charte KOSMO® (tokens, composants, animations) reprise telle quelle ; `npm run check:tokens` passe.

## À valider (rédigé sans validation)
- **Domaine** : `ai.kosmocgi.com` provisoire (astro.config.mjs + src/lib/seo.ts).
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
- AI music videos, AI explainer videos, AI influencers, AI UGC ads, AI photoshoot : films de remplacement pris dans le
  portfolio. Idéalement, de vraies productions IA de KOSMO® pour ces pages.
- Les vidéos et logos hébergés sur framer-bg-videos.b-cdn.net / framerusercontent.com ne sont pas copiés en local.

## Pas encore fait
- Article « Best AI commercials » (cluster 4 000+ recherches/mois) et les 4 articles GEO.
- Nettoyage de public/ (assets 3DOOH inutilisés, ~60 Mo).
