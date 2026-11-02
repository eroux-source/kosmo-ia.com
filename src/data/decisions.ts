/**
 * Décisions prises sans validation (consigne : « ne t'arrête pas pour poser des questions »).
 * Chaque entrée est listée sur /todo. `where` = où changer si tu tranches autrement.
 */
export interface Decision {
  id: string;
  sprint: 1 | 2 | 3 | 4;
  title: string;
  choice: string;
  why: string;
  where: string[];
}

export const decisions: Decision[] = [
  {
    id: 'delay',
    sprint: 1,
    title: 'Délai unifié',
    choice: '« 3–4 weeks from validated brief to delivery » partout (hero, offre, FAQ, partenaires).',
    why: 'C’est le seul chiffre confirmé (conditions partenaires). Le hero disait 6 semaines, la FAQ « a few weeks ».',
    where: ['src/data/3dooh.ts → hero.chips', 'src/data/faq.ts → timing', 'src/data/partners.ts'],
  },
  {
    id: 'views-figure',
    sprint: 1,
    title: 'Chiffre d’audience : 750M+ vs 3B+',
    choice: '3B+ earned and owned media (tranché le 27/09 : « 750M+ organic views » ne doit plus apparaître). Depuis le 05/10, ce n’est plus l’argument principal : remplacé en tête par « 150+ campaigns in 14 countries » (voir facts-2026-10-05).',
    why: 'Demande explicite ; l’ancien kit (../Vibe_Site_KOSMO) disait déjà de ne plus utiliser 750M+.',
    where: ['src/data/stats.ts', 'src/data/3dooh.ts → hero.proof', 'src/data/site.ts → nav.services'],
  },
  {
    id: 'brief-upload',
    sprint: 1,
    title: 'Dépôt de brief / pixel map',
    choice: 'Un champ « lien » (Drive, WeTransfer…) plutôt qu’un upload de fichier.',
    why: 'Un upload passerait par l’API Files HubSpot et un stockage ; un lien suffit pour qualifier et reste simple à maintenir.',
    where: ['src/components/ui/FreeConceptForm.astro', 'src/lib/lead.ts'],
  },
  {
    id: 'budget-ranges',
    sprint: 1,
    title: 'Fourchettes de budget du formulaire',
    choice: 'Under €100k · €100k to €250k · €250k to €500k · €500k to €1M · €1M to €5M · €5M and above (paliers donnés le 27/09).',
    why: 'Demande du 27/09 : partir de 100 k€ et monter jusqu’à 5 M€ de budget média.',
    where: ['src/lib/lead.ts → BUDGET_RANGES'],
  },
  {
    id: 'hubspot-properties',
    sprint: 1,
    title: 'Propriétés HubSpot',
    choice: 'Le lead est poussé sur les propriétés standard (email, company, firstname, lastname, jobtitle, message). Les champs de qualification et les UTM sont dans « message » et, si elles existent, dans des propriétés personnalisées kosmo_*.',
    why: 'Sans créer les propriétés dans HubSpot, un envoi avec des champs inconnus échoue. La fonction tente d’abord les propriétés kosmo_*, puis se replie sur les standards.',
    where: ['src/lib/hubspot.ts → EXTENDED_PROPERTIES', 'HubSpot → Paramètres → Propriétés (à créer)'],
  },
  {
    id: 'booking-tool',
    sprint: 1,
    title: 'Prise de rendez-vous',
    choice: 'Agenda Google Calendar (lien fourni le 27/09) intégré en iframe sur /book, la page merci et la page checklist, avec un lien « open in Google Calendar » et WhatsApp / email à côté. PUBLIC_BOOKING_URL permet de passer à HubSpot Meetings.',
    why: 'Le bouton flottant du script Google n’est pas accessible au clavier et impose sa couleur ; l’iframe reste dans la charte et se navigue au clavier.',
    where: ['src/components/ui/BookingEmbed.astro', '.env.example'],
  },
  {
    id: 'analytics-stack',
    sprint: 1,
    title: 'Analytics',
    choice: 'Plus de bandeau cookies (demande de Mehdi, 20/10) : Plausible, Vercel Analytics, GA4, Contentsquare, RB2B, et Clarity / pixels LinkedIn et Meta s’ils sont configurés, se chargent tous sans consentement. Politique de confidentialité mise à jour.',
    why: 'Le bandeau gênait la navigation et bloquait la mesure. Risque RGPD pour les visiteurs européens (cookies sans consentement), assumé comme pour RB2B et Contentsquare le 27/09.',
    where: ['src/components/ui/Analytics.astro', 'src/scripts/analytics.ts', '.env.example'],
  },
  {
    id: 'nav-links',
    sprint: 1,
    title: 'Liens morts de la nav et du footer',
    choice: 'Retirés tant que la page n’existe pas (About, Blog, Creative strategy, Social). Réintroduits au sprint 4 avec les vraies pages.',
    why: 'Consigne « plus aucun lien mort » à la fin du sprint 1.',
    where: ['src/data/site.ts → nav, footer'],
  },
  {
    id: 'copy-rewrites',
    sprint: 1,
    title: 'Copy générique du template réécrite (marquée DÉMO)',
    choice: 'Hero « The new way to display » → titre + sous-titre explicites ; process, équipe, footer : nouvelles phrases. Les originaux restent dans les fichiers data (champ `original`).',
    why: 'Audit §4G : ces phrases ne disent pas ce que KOSMO® vend.',
    where: ['src/data/3dooh.ts', 'src/data/site.ts'],
  },
  {
    id: 'industries-section',
    sprint: 1,
    title: 'Section « Industries »',
    choice: 'Retirée de /3dooh (répétait 4 fois le même visuel), conservée en composant pour la home.',
    why: 'Audit §2 problème 6 et ordre §4E qui ne la liste pas.',
    where: ['src/pages/3dooh.astro', 'src/components/sections/Industries.astro'],
  },
  {
    id: 'bunny-referrer',
    sprint: 1,
    title: 'Vidéos Bunny bloquées hors du domaine Webflow',
    choice: 'Posters locaux partout (public/images/posters) ; les MP4 restent sur Bunny. À faire côté Bunny : ajouter localhost, *.vercel.app et kosmocgi.com aux « Allowed referrers » de la pull zone vz-78bf47d9-72b.',
    why: 'Le CDN renvoie 403 pour tout referrer non listé : les vidéos sont vides en local et sur la preview Vercel tant que l’allowlist n’est pas mise à jour.',
    where: ['Bunny → Pull zone → Security → Allowed referrers', 'src/data/3dooh.ts → bunny()'],
  },
  {
    id: 'case-videos',
    sprint: 2,
    title: 'Vidéos des cas de démonstration',
    choice: 'Les 7 cas utilisent les 7 vidéos « par ville » de la référence, avec des clients fictifs (Brand A…G) et des chiffres inventés, tous marqués DÉMO.',
    why: 'Ce sont les seules vidéos disponibles. Elles montrent des marques réelles à l’image : avant publication, soit confirmer client + chiffres réels par cas, soit remplacer la vidéo.',
    where: ['src/content/cases/*.md'],
  },
  {
    id: 'stats-figures',
    sprint: 2,
    title: 'Bande de chiffres',
    choice: 'Quatre chiffres confirmés le 27/09 : 3B+ earned and owned media, 150+ campagnes, 14 pays, 750+ écrans (les chiffres de démonstration 40+ / 12 / 300+ sont remplacés).',
    why: 'L’audit demande « uniquement des chiffres que tu peux défendre » : remplace ou supprime ceux marqués DÉMO.',
    where: ['src/data/stats.ts'],
  },
  {
    id: 'faq-policies',
    sprint: 3,
    title: 'Réponses FAQ qui engagent une politique',
    choice: 'Propriété du master 3D (« you do » après paiement), positionnement IA (« both, honestly »), devis sous 24h, resoumission gérée : rédigés en DÉMO.',
    why: 'Ce sont des engagements commerciaux, pas des faits confirmés. À valider ou reformuler.',
    where: ['src/data/faq.ts'],
  },
  {
    id: 'checklist-pdf',
    sprint: 3,
    title: 'Checklist régie en PDF',
    choice: 'PDF généré au build (scripts/build-checklist-pdf.mjs, police Helvetica, couleurs de la charte) depuis src/data/checklist.json. Envoyé après un email (formulaire « checklist » → HubSpot, form=checklist).',
    why: 'Pas de TTF Hanken Grotesk sous la main pour pdfkit ; l’envoi par email n’est pas branché (la page /checklist/thanks affiche le lien de téléchargement).',
    where: ['scripts/build-checklist-pdf.mjs', 'src/data/checklist.json', 'src/pages/checklist/'],
  },
  {
    id: 'deck-format',
    sprint: 3,
    title: 'Page /deck',
    choice: 'Page « deck » scrollable (8 sections numérotées) avec un emplacement pour la vidéo de pitch de 2–3 min, pas de PDF.',
    why: 'Le contenu vidéo n’existe pas encore ; la page reste utile comme résumé partageable pour les décideurs.',
    where: ['src/data/deck.ts', 'src/pages/deck.astro'],
  },
  {
    id: 'city-inventory',
    sprint: 4,
    title: 'Pages villes : inventaire d’écrans',
    choice: 'Dubai et London listent 5 types d’emplacements chacune (DÉMO) et réutilisent les cas de la ville.',
    why: 'L’inventaire réel par régie n’est pas fourni ; les noms de lieux restent génériques pour ne pas affirmer une disponibilité.',
    where: ['src/data/cities.ts'],
  },
  {
    id: 'services-scope',
    sprint: 4,
    title: 'Pages services',
    choice: '/fooh sur le gabarit de /3dooh (ServicePage.astro, remplacé le 22/10/2026 par une page propre, src/pages/fooh.astro). Le service « Full CGI » (page /cgi, entrées de menu, discipline « 03 ») est retiré partout le 27/09. Pas de page /social ni « Creative strategy ».',
    why: 'Consigne du 27/09 : KOSMO® vend 3DOOH et FOOH ; la CGI reste une technique, pas une offre.',
    where: ['src/data/services.ts', 'src/data/site.ts → nav.services'],
  },
  {
    id: 'partner-price',
    sprint: 4,
    title: 'Prix marque blanche',
    choice: 'Pas de prix sur /partners (le champ prix et showPrice sont supprimés le 05/10). La page montre le délai, les deux rounds et « quote within 24h ».',
    why: 'Le « à partir de 15 000 $ par asset » est faux (Mehdi, 05/10) : pas de prix fixe, le devis dépend du resizing et du nombre d’écrans.',
    where: ['src/data/partners.ts → terms'],
  },
  {
    id: 'offer-simplified',
    sprint: 4,
    title: 'Offre « concept gratuit » sans livrables ni urgence',
    choice: 'Plus de « visuel statique sous 72h » ni de « call de 15 min » présentés comme livrables. On promet un concept pour l’écran et on pousse vers la réservation d’un call.',
    why: 'Consigne : rien de produit n’est offert, seulement un concept écrit ; l’urgence nuisait à la crédibilité.',
    where: ['src/data/3dooh.ts → offer, conceptCta', 'src/pages/thank-you.astro'],
  },
  {
    id: 'form-simplified',
    sprint: 4,
    title: 'Formulaire simplifié',
    choice: 'Étape 2 : nom, période, marché, budget média (« Under €100k » / « €100k and above »), brief en texte libre. Plus de régie, plus de lien, plus de fonction.',
    why: 'Consigne : moins de champs, budget média en deux fourchettes, un brief écrit, et le call comme meilleur pas suivant.',
    where: ['src/components/ui/FreeConceptForm.astro', 'src/lib/lead.ts'],
  },
  {
    id: 'single-entity',
    sprint: 4,
    title: 'Une seule société, pas de rattachement à un lieu',
    choice: 'KOSMO CGI SAS uniquement dans les mentions légales, la politique de confidentialité et le JSON-LD Organization (legalName, SIREN). Pied de page : « © KOSMO® » (05/10). Plus de mention de KSM F.Z.E. ni de « Dubai and Paris » dans la copy.',
    why: 'Consigne : la société est globale ; l’entité de Dubaï est un sujet administratif.',
    where: ['src/data/site.ts', 'src/data/legal.ts', 'src/lib/seo.ts', 'src/data/about.ts'],
  },
  {
    id: 'legal-entities',
    sprint: 1,
    title: 'Mentions légales',
    choice: 'Éditeur : KOSMO CGI SAS (SIREN 930 375 902). Adresse, capital, directeur de publication : à compléter. Textes rédigés en DÉMO.',
    why: 'Faits confirmés utilisés tels quels ; le reste doit être validé par toi (ou un conseil).',
    where: ['src/data/legal.ts'],
  },
  {
    id: 'brand-logos',
    sprint: 4,
    title: 'Ligne de preuve du hero : marques à la place des régies',
    choice: 'Netflix, Miele, Uber, Pringles, Zalando, Lego (liste du 27/09) sous « 3B+ earned and owned media ». La bande de logos de la référence est conservée telle quelle.',
    why: 'Consigne du 27/09. Les logos officiels ne servent que dans les témoignages (BrandLogo : SVG s’il est déposé dans src/assets/logos/brands/, sinon le nom en lettres).',
    where: ['src/data/site.ts → brands', 'src/data/3dooh.ts → hero.proof', 'src/components/ui/BrandLogo.astro'],
  },
  {
    id: 'testimonials-dm',
    sprint: 4,
    title: 'Témoignages façon message privé',
    choice: 'Cinq messages courts d’exemple attribués à Netflix, Uber, Maisons du Monde, Miele et Zalando (fonction, pas de nom), marqués DÉMO.',
    why: 'Format demandé le 27/09. Les citations sont inventées : à remplacer par de vrais messages reçus et à faire valider par chaque marque avant mise en ligne.',
    where: ['src/data/testimonials.ts'],
  },
  {
    id: 'fooh-projects',
    sprint: 4,
    title: 'Projets FOOH importés de Framer',
    choice: 'Les 56 projets publiés sur /work#fooh et /work/fooh/[slug] (y compris Netflix, Asus, Pringles, Bose, signalés « accord à obtenir » dans l’export). Tous présentés comme des commandes du client, la marque en client (Apple, Disney+, Rhode). Citations internes non affichées. Chiffres de campagne (Oysho, Squid Game, Renault) montrés une fois, sur le premier volet, avec la mention « across the N films ». Villes à confiance basse masquées. Médias encore hébergés chez Framer (à rapatrier sur Bunny).',
    why: 'Brief puis correction du 27/09 (tout publier, ce sont de vraies commandes) ; les points restants sont listés section 4 de /todo.',
    where: ['src/data/fooh/projects.json', 'src/lib/fooh.ts', 'src/pages/work/fooh/[slug].astro'],
  },
  {
    id: 'miele-case-study',
    sprint: 4,
    title: 'Étude de cas Miele HydroClean dans le journal',
    choice: 'Article /journal/miele-hydroclean-case-study rédigé le 27/09 uniquement à partir de sources internes (deck Figma « miele hydroclean », film showcase du 17/07, emails Miele Western Europe d’avril à septembre 2026, canaux Slack du projet). Chiffres : 81 écrans, 76 villes, 4 pays, 5 langues, 300+ versions (deck + film). Film showcase publié en 720p (public/video/journal). Citation de Nathalie Dubois reprise de son email du 01/06 (elle proposait elle-même une recommandation). Le 27/09 aussi : projet client 3DOOH (src/content/cases/miele-hydroclean.md, logo = client-24.svg de la référence), projet FOOH (film social sans logo, 720p) et animatique du 6 s (v3 du 21/04) en coulisses du cas et dans l’article.',
    why: 'Demande du 27/09. Avant diffusion large : faire confirmer par Miele la publication du nom, de la citation et du film showcase (le film porte le logo Cityz Media et des images des écrans).',
    where: ['src/content/posts/miele-hydroclean-case-study.md', 'public/video/journal/miele-hydroclean-showcase.mp4', 'public/images/journal/'],
  },
  {
    id: 'seo-canonical-host',
    sprint: 4,
    title: 'Hôte canonique et politique robots IA',
    choice: 'Hôte canonique = https://www.kosmocgi.com (cible de la redirection Vercel), URLs sans slash final, sitemap et robots alignés. robots.txt en « default-open » : moteurs de recherche, robots de retrieval IA et robots d’entraînement IA autorisés, pages utilitaires exclues.',
    why: 'Audit SEO/GEO du 27/09 (docs/SEO-GEO-AUDIT.md) : les canonicals pointaient vers l’apex qui redirige, doublons /page et /page/. Le site cherche la visibilité et la citation dans les moteurs de réponse. Pour inverser : changer `site` (astro.config.mjs) et SITE.url (src/lib/seo.ts) ; pour refuser l’entraînement, passer le 3e bloc de robots.txt en Disallow.',
    where: ['astro.config.mjs', 'src/lib/seo.ts', 'public/robots.txt', 'vercel.json'],
  },
  {
    id: 'demo-cases-removed',
    sprint: 4,
    title: 'Cas de démonstration retirés',
    choice:
      'Les sept cas fictifs (Brand A…G : Paris, Dubaï, Tokyo, Londres, Berlin, Bruxelles, New York) sont supprimés. Il reste un cas 3DOOH réel (Miele HydroClean) et les 57 projets FOOH (56 de Framer + Miele). Les anciennes URL /work/<cas> redirigent en 301 vers /work. La map monde garde ses sept villes (vidéos d’écrans de la référence) mais un repère n’a de lien que si un projet publié s’y trouve (Paris, Dubaï) ; les pages villes Dubai / London et la home complètent leur rangée avec les projets FOOH.',
    why: 'Demande du 27/09 (« retire les projets fictifs »). Pour retrouver une rangée de trois cas 3DOOH sur /3dooh, ajouter de vrais cas dans src/content/cases avec demo: false.',
    where: ['src/content/cases/', 'src/data/world.ts', 'src/components/sections/WorldMap.astro', 'src/components/sections/FeaturedCases.astro', 'astro.config.mjs'],
  },
  {
    id: 'city-pages',
    sprint: 4,
    title: 'Treize pages villes : les plus gros marchés DOOH',
    choice:
      'New York, Los Angeles, Las Vegas, Londres, Paris, Berlin, Madrid, Milan, Amsterdam, Dubaï, Riyad, Tokyo, Séoul. Choix vérifié le 28/09 : classement mondial OOH 2025 (WOO / invidis : Chine, États-Unis, Japon, Royaume-Uni, Allemagne, France, Brésil, Corée du Sud, Australie, Italie) et parts de marché DOOH Europe (IMARC : Royaume-Uni ≈ 18 %, Allemagne ≈ 15 %, France ≈ 12 %, Espagne et Italie ≈ 8 % chacune), plus Dubaï (entité KSM) et Riyad (marché du Golfe en plus forte croissance). Bruxelles, Bordeaux et Abidjan retirées (301 vers Amsterdam, Paris et /3dooh). Villes sans image : couverture animée. Textes, emplacements et FAQ locales rédigés (DÉMO) ; régies limitées à la liste confirmée ou « Local media owners on request ».',
    why: 'Demande du 28/09 : viser les plus gros marchés plutôt que les villes où on a déjà travaillé. Les chiffres de marché cités dans les intros (« second largest », « largest in Europe »…) viennent de ces sources ; les emplacements listés restent génériques, à vérifier ville par ville.',
    where: ['src/data/cities.ts', 'src/data/site.ts (footer.groups)'],
  },
  {
    id: 'city-pages-wave-1',
    sprint: 4,
    title: 'Pages villes, vague 1 (SEO local) : 21 villes, guide local sourcé',
    choice:
      "Validé par Mehdi le 22/10 : 21 villes (New York, Los Angeles, Las Vegas, Miami, Chicago, Londres, Manchester, Birmingham, Paris, Lyon, Berlin, Hambourg, Munich, Cologne, Amsterdam, Rotterdam, Madrid, Milan, Dubaï, Abou Dhabi, Riyad ; Tokyo et Séoul restent hors vague), gabarit v2 (guide local sourcé en Markdown, sections génériques retirées), langue principale par ville, pas de version arabe. Pris sans validation : toutes les villes dans le footer sur deux colonnes (décision de Mehdi du 23/10, à la place d'un bloc de boutons sur /3dooh), les sous-services de l'anamorphique décalés sous « Anamorphic 3D » dans le footer, Miami et Chicago ajoutées à la carte du monde (les autres nouvelles villes sont trop proches de repères existants), les images des anciennes pages gardées mais légendées « Illustration » (ce ne sont pas des projets réels dans ces villes), l'image de Riyad retirée (illustration générée qui pouvait passer pour une campagne), le fil d'Ariane qui passe par /3dooh/billboards, les prix catalogue publiés quand une régie les publie (WallDecaux Berlin, aéroport de Munich, JCDecaux et Global Amsterdam), avec leur date.",
    why: 'Recherche Semrush du 22/10 (docs/SEO-LOCAL-KEYWORDS.md) et architecture validée (docs/SEO-LOCAL-ARCHITECTURE.md). Faits uniquement sourcés ; les manques sont listés par ville (champ missing, sur /todo).',
    where: ['src/data/cities.ts', 'src/content/cities/*.md', 'src/pages/3dooh/[city].astro', 'src/data/site.ts (footer)', 'src/data/world.ts'],
  },
  {
    id: 'social-and-brand-logos',
    sprint: 4,
    title: 'Réseaux sociaux et logos de marques',
    choice:
      'Icônes officielles (Simple Icons, monochromes) d’Instagram, LinkedIn, TikTok et YouTube dans le footer (groupe « Follow » + barre légale) ; retirées de la nav le 27/09 à la demande. Logos SVG de la bande de la référence (client-XX.svg) repris sous leur nom pour 25 marques (Netflix, Uber Eats, Maisons du Monde, Miele, Zalando, Pringles, Lego, Rhode, Oysho…) : témoignages, ligne de preuve du hero (logos à la place des noms), /careers, chips des projets FOOH (clients.json). « Uber » renommé « Uber Eats », le client réel.',
    why: 'Demande du 27/09. Les logos Framer restants (Renault, Porsche, UEFA…) sont conservés tels quels tant qu’un SVG propre n’est pas déposé.',
    where: ['src/assets/logos/brands/', 'public/images/logos/', 'src/data/fooh/clients.json', 'src/assets/icons/brand-*.svg', 'src/lib/seo.ts (SITE.social)'],
  },
  {
    id: 'journal-shader-covers',
    sprint: 4,
    title: 'Couvertures animées du journal',
    choice:
      'Les articles sans image de couverture reçoivent une illustration animée en WebGL (voiles de deux couleurs qui ondulent, port du shader « aurora veil » fourni le 27/09), avec une paire de couleurs unique par article (16 paires dans tokens.css, --shader-N-a/-b, attribuées par rang). Les couvertures génériques réutilisées (affiches des villes, images partenaires) ont été retirées des 13 articles rédigés ; seul le cas Miele garde sa vraie image. Dégradé statique en repli sans WebGL ou avec prefers-reduced-motion.',
    why: 'Demande du 27/09 : illustrations colorées et animées quand il n’y a pas d’image, jamais la même combinaison pour deux articles. Les couleurs hors charte (bleus, roses, turquoise…) sont limitées à ces couvertures et vivent dans tokens.css.',
    where: ['src/styles/tokens.css (--shader-*)', 'src/lib/shader.ts', 'src/components/ui/ShaderCover.astro', 'src/scripts/shader-cover.ts'],
  },
  {
    id: 'netflix-big-mistakes',
    sprint: 4,
    title: 'Netflix Big Mistakes : deux projets FOOH et un article',
    choice:
      'Deux projets FOOH (big-mistakes-i = caméra de surveillance, big-mistakes-ii = vue depuis la voiture, ordre choisi par moi) et une étude de cas dans le journal. Faits en ligne (Netflix Tudum, What’s on Netflix, Wikipedia, Variety) : billboard réel sur Sunset Boulevard posé le 10/03/2026, collier 4.9.26, vidéo du vol puis selfies du casting, première mondiale au Paris Theater le 06/04, sortie le 09/04/2026, Top 10 anglophone (n° 8 avec 2,7 M de vues, puis n° 3 avec 4,4 M), renouvelé le 13/05/2026. Faits donnés par Mehdi, non vérifiables : première vidéo du compte Instagram Big Mistakes, 35K abonnés organiques. Le film du compte officiel (collier en place, logo Netflix) est présenté comme « posté sur le compte Big Mistakes », sans dire qui l’a produit.',
    why: 'Demande du 28/09 : deux projets et un article cohérents avec les résultats de la série. Les vidéos sont hébergées sur le site (720p, 1,6 / 3 / 2 Mo), pas sur Bunny. Aucun chiffre de vues des films : Mehdi n’en a pas donné.',
    where: ['src/data/fooh/projects.json', 'src/content/posts/netflix-big-mistakes-fooh.md', 'public/video/fooh/big-mistakes-*.mp4', 'public/images/journal/big-mistakes-*'],
  },
  {
    id: 'super-mario-galaxy-yoshi-eggs',
    sprint: 4,
    title: 'Super Mario Galaxy Movie : œufs de Yoshi à New York',
    choice:
      'Projet FOOH ajouté comme concept à l’initiative de KOSMO® (client = KOSMO, marque Nintendo), sur le modèle des projets Apple et Disney+ de l’export Framer, daté du 30/03/2026 (avant la sortie du film le 01/04/2026). Chiffres repris du tableau de résultats fourni par Mehdi : 15M earned media impressions, 500K engagements, 5M vues, 0 $ de paid. Les deux films Maisons du Monde de Noël (Sacré-Cœur, tour Eiffel) sont repassés de Bordeaux à Paris.',
    why: 'Demande du 28/09. Rien n’indique une commande de Nintendo ou d’Universal : si le film a été commandé, passer client à la marque et commissioned à true. La date exacte de publication n’a pas été donnée.',
    where: ['src/data/fooh/projects.json', 'src/data/fooh/clients.json', 'public/video/fooh/super-mario-galaxy-yoshi-eggs.mp4'],
  },
  {
    id: 'nintendo-case-study-ai',
    sprint: 4,
    title: 'Étude de cas Nintendo : production IA et logo de marque',
    choice:
      'Article journal « Nintendo Yoshi eggs » qui présente le film comme produit avec l’IA (produit, production, variantes) et met en avant les atouts de l’agence avec les chiffres confirmés (150+ campagnes, 14 pays, 750+ écrans, 3B+). Formulation « in days, not weeks » pour la vitesse : à valider. Logo Nintendo (Simple Icons, CC0) ajouté dans src/assets/logos/brands et public/images/logos ; les pages des projets à l’initiative de KOSMO affichent désormais le logo de la marque visée (Nintendo, Apple, Rhode, Disney+) au lieu du logo KOSMO.',
    why: 'Demande du 28/09. Point à trancher : la FAQ « Is it AI? » dit que le 3D final est fait par l’équipe ; l’article dit que ce film est produit en IA. Les deux sont compatibles (IA pour un concept social, 3D maison pour un écran DOOH) mais la FAQ mérite une phrase en ce sens.',
    where: ['src/content/posts/nintendo-super-mario-galaxy-yoshi-eggs.md', 'src/data/faq.ts (Is it AI?)', 'src/pages/work/fooh/[slug].astro (logo)'],
  },
  {
    id: 'zalando-lounge-balance',
    sprint: 4,
    title: 'Zalando Lounge : la pile en équilibre sur un banc parisien',
    choice:
      'Projet FOOH commandé (client Zalando, nouveau client dans clients.json avec le logo officiel), Paris, daté du 15/09/2026, sans chiffre sur la tuile : la vidéo est à 844K vues et approche le million, le texte dit « close to a million views and still climbing ». Saison non nommée (brief : « Printemps Hiver », feuilles mortes à l’image).',
    why: 'Demande du 28/09 avec peu d’éléments. Quand le million est passé, ajouter metrics.earnedMedia (display « 1M+ ») et retirer la phrase du texte. Date exacte de publication à donner.',
    where: ['src/data/fooh/projects.json', 'src/data/fooh/clients.json', 'public/video/fooh/zalando-lounge-balance.mp4'],
  },
  {
    id: 'avatar-earth-kingdom-public-works',
    sprint: 4,
    title: 'Netflix Avatar : Earth Kingdom Public Works, projet et article',
    choice:
      'Projet FOOH (client Netflix, Los Angeles, 20/06/2026) et étude de cas dans le journal. Le reel fourni est carré (1:1) : format ajouté au modèle (videoRatio « 1:1 »), aux cartes de /work (une colonne, hauteur intermédiaire), à l’aperçu de la vue liste et à la page projet. Faits en ligne : saison 2 sortie le 25/06/2026 (7 épisodes, Toph jouée par Miyako, Ba Sing Se), légende du post @avatarnetflix du 20/06 « The earthbenders have arrived », n° 2 du Top 10 anglophone avec 8,7 M de vues en quatre jours (64,6 M d’heures), saison 3 confirmée pour 2027 (Wikipedia, What’s on Netflix, Variety). Faits donnés par Mehdi, non vérifiés : +30K likes (affiché comme engagement sur la tuile), compte à +650K abonnés, des gens sont allés chercher le tag dans la rue.',
    why: 'Demande du 28/09. Le tag « Earth Kingdom Public Works » n’a pas de source en ligne trouvée : présenté d’après la photo et le reel fournis.',
    where: ['src/data/fooh/projects.json', 'src/content/posts/netflix-avatar-earth-kingdom-public-works.md', 'src/components/ui/MosaicCard.astro', 'src/lib/fooh.ts'],
  },
  {
    id: 'zalando-prive-tennis',
    sprint: 4,
    title: 'Privé by Zalando, saison du tennis : le FOOH seul pour l’instant',
    choice:
      'Projet FOOH (client Zalando, Paris, 07/06/2026) décrit comme une pièce d’une campagne plus large (vox pop, BTS, joybaiting, influence avec Anekdote, cinq joueurs sponsorisés avec P11), d’après le one-pager du 09/06/2026. Les chiffres de campagne (7M+ broadcast reach estimé, 300K+ earned media impressions, 25K+ engagements) sont dans le texte, pas sur la tuile, parce qu’ils ne mesurent pas ce seul film. Fontaine de l’Observatoire nommée (confirmée par Mehdi).',
    why: 'Demande du 28/09 : ajouter le projet avec le PDF pour contexte, les autres vidéos viendront plus tard. Quand elles arrivent, créer une série « zalando-prive-tennis » avec metrics.scope « campaign » pour afficher les chiffres une fois pour toute la série.',
    where: ['src/data/fooh/projects.json'],
  },
  {
    id: 'concept-cta-video',
    sprint: 4,
    title: 'Bloc concept gratuit : film FOOH en biais',
    choice:
      'L’image Tokyo du bloc est remplacée par le showreel FOOH 30 s (video/out/kosmo-showreel-fooh-30s.mp4, encodé muet en 720p, 6,8 Mo, chargé à l’approche et mis en pause hors écran). Le film entre en fondu + glissement et se pose à -5° (rotation des cartes industries de la référence), puis se redresse au survol. Valeurs dans motion-tokens.ts (tilt).',
    why: 'Demande du 28/09 : « un peu en biais avec une jolie animation ». Aucune nouvelle valeur : rotation, durées et easings repris de patterns existants (cartes industries, fade, survol des boutons).',
    where: ['src/components/ui/ConceptCta.astro', 'src/scripts/animations.ts', 'src/scripts/motion-tokens.ts', 'src/data/3dooh.ts'],
  },
  {
    id: 'pinterest-fooh-csv',
    sprint: 4,
    title: 'Pinterest : import en masse des 63 films FOOH',
    choice:
      'CSV d’import Pinterest (docs/pinterest/fooh-video-pins.csv, `npm run pinterest`) : une épingle vidéo par projet FOOH, titre et description rédigés en anglais à partir de projects.json (chiffres de `metrics` uniquement, citations internes jamais reprises), lien vers /work/fooh/<slug> avec UTM pinterest / social / fooh-pins, vignette = poster du site. Six tableaux par secteur (Fashion & Beauty, Entertainment & Gaming, Sports, Retail & Food, Tech & Product Launches, B2B/Real Estate/Events), créés par Pinterest à l’import. Publication étalée : 2 par jour à 09:00 et 16:00 UTC à partir du 29/09/2026. Les 7 projets `restrictedClient` (Asus ×2, Bose, Pringles, Squid Game ×3) sont en fin de fichier pour pouvoir les retirer. Icade et Heavent I étaient en .mov chez Framer : convertis en MP4 720p dans public/video/fooh (le site garde le .mov).',
    why: 'Demande du 28/09 (balise p:domain_verify ajoutée le même jour). Pinterest n’accepte que .mp4/.png/.jpeg et 200 lignes par import ; l’étalement évite de publier 63 épingles d’un coup.',
    where: ['scripts/build-pinterest-fooh.mjs (textes COPY, tableaux BOARDS, calendrier)', 'docs/pinterest/fooh-video-pins.csv'],
  },
  {
    id: 'home-bridge',
    sprint: 4,
    title: 'Home « pont » : le modèle de campagne plutôt qu’une page 3DOOH allégée',
    choice:
      'La home ne vend plus les écrans seuls : hero sur la promesse commune (« Real screens. Real streets. ») avec deux CTA (concept gratuit 3DOOH, voir les films FOOH), les deux disciplines présentées comme deux portes juste sous les logos, le showreel FOOH en preuve, puis la courbe impressions / temps en quatre couches (3DOOH, FOOH, stunt OOH, RP) qui explique le modèle donné par Mehdi le 28/09, les travaux récents FOOH d’abord puis le cas Miele, chiffres, carte, industries, témoignages, contact. Process, équipe et FAQ retirés de la home (ils restent sur /3dooh). La courbe accepte désormais trois ou quatre phases et une bande surlignée configurable.',
    why: 'Retour du 28/09 : la home était trop 3DOOH et pas assez FOOH, alors que la preuve (58 films) est FOOH et l’offre est 3DOOH. Le modèle « campagne 3DOOH, amplifiée par un FOOH, soutenue par un stunt OOH, relayée par la RP » vient de Mehdi ; les textes des phases sont de moi (DÉMO).',
    where: ['src/pages/index.astro', 'src/data/home.ts', 'src/components/sections/ReachCurve.astro', 'src/components/sections/FeaturedCases.astro (foohFirst)', 'src/components/sections/Services.astro (heading, intro)'],
  },
  {
    id: 'media-owner-logos',
    sprint: 4,
    title: 'Bandeau des régies : dix régies des marchés visés ajoutées',
    choice:
      'Aux quatre régies citées au départ comme partenaires (JCDecaux, Cityz Media, Phi advertising, iDOOH : ce ne sont pas des partenaires, voir facts-2026-10-05) s’ajoutent Clear Channel Outdoor, Outfront Media et Lamar (États-Unis), Global, Ocean Outdoor et Bauer Media Outdoor (Royaume-Uni et Europe, ex-Clear Channel Europe : Espagne, Italie, Pays-Bas), Ströer et blowUP media (Allemagne), BackLite Media et Hypermedia (Émirats). Logos officiels en SVG (Wikimedia Commons pour Clear Channel, Lamar, Outfront, Ströer ; sites des régies pour les autres), passés en noir, largeurs calées sur une hauteur visuelle commune. Le surtitre passe de « our partners » à « media owners » pour ne pas annoncer un partenariat qui n’existe pas ; le titre « We speak every media owner’s specs » reste une affirmation de capacité. Pas de logo SVG trouvé pour l’Arabie saoudite (Al Arabia), le Japon (MCDecaux, Cross Space) ni la Corée (CJ Powercast) ; Callao City Lights, IGPDecaux et Urban Vision sans SVG accessible.',
    why: 'Demande du 28/09. Une vraie marque ne doit pas être associée à une relation inventée (CLAUDE.md) : d’où le changement de surtitre, listé dans docs/CLAIMS.md.',
    where: ['src/data/3dooh.ts (partners)', 'public/images/partners/*.svg', 'docs/CLAIMS.md'],
  },
  {
    id: 'anamorphic-keyword',
    sprint: 4,
    title: 'SEO : « anamorphic » avant « 3DOOH »',
    choice:
      'Retour d’Eugène (28/09, Google Keyword Planner) : « anamorphic » fait 10 k à 100 k recherches par mois, « 3DOOH » presque rien. Les titres SEO, descriptions, H1 et libellés de navigation portent désormais « anamorphic billboard(s) » / « anamorphic 3D » en premier, avec 3DOOH en second (nom du produit, entre parenthèses ou en sous-titre) : page /3dooh (title, description, H1, sous-titre), 13 pages villes (title, description, H1, JSON-LD), home, about, partners, work, deck, organisation JSON-LD (knowsAbout), nav et footer (« Anamorphic billboards »), deux questions de FAQ, trois articles (what-is-3dooh, cost, choose-an-agency). Slugs et URLs inchangés.',
    why: 'Volume de recherche. Le terme 3DOOH reste partout dans le corps des textes et comme nom de catégorie, il n’est pas supprimé.',
    where: ['src/pages/3dooh.astro', 'src/data/3dooh.ts (hero)', 'src/data/cities.ts', 'src/pages/3dooh/[city].astro', 'src/data/home.ts', 'src/data/about.ts', 'src/data/site.ts (nav, footer)', 'src/lib/seo.ts', 'src/data/faq.ts', 'src/content/posts/*.md'],
  },
  {
    id: 'about-founders-press',
    sprint: 4,
    title: 'Page About : fondateurs et annonce CB News',
    choice:
      'Nouvelle section « Founders » (deux cartes : photo de l’équipe, rôle de la référence, bio, lien LinkedIn) et bloc « In the press » qui relaie l’article CB News du 16/09/2024 (citation traduite en anglais, original français conservé et affiché, résumé avec les clients cités par l’article). Le manifeste mentionne la fondation en septembre 2024. Rôles : CEO (Mehdi) et Head of Accounts (Eugène), comme dans la référence ; « creative » et « sales » dans les bios (dit par Mehdi). L’article écrit « Peoman » : rendu « Proman », client FOOH connu (projects.json).',
    why: 'Demande du 28/09. LinkedIn bloque la lecture des profils (HTTP 999) : aucune date, école ou poste précis n’a été repris au-delà de l’article et du brief de Mehdi. Les grandes marques citées (Gucci, Nike, Nestlé…) sont attribuées à CB News, pas présentées comme des cas.',
    where: ['src/data/about.ts (founders, press)', 'src/pages/about.astro'],
  },
  {
    id: 'i18n-architecture',
    sprint: 4,
    title: 'Site en quatre langues : anglais à la racine, /fr, /de, /nl',
    choice:
      'Sous-répertoires sur www.kosmocgi.com, URL anglaises inchangées (x-default), slugs traduits sur le mot-clé local (/fr/a-propos, /de/ueber-uns, /nl/over-ons, articles du journal). Ciblage par langue et non par pays (hreflang fr, de, nl). Traduction par dictionnaire au build : la page anglaise est rendue puis ses textes, attributs, meta, JSON-LD et liens sont remplacés (src/i18n). Une page n’existe dans une langue que traduite ; npm run check:i18n échoue s’il manque un texte.',
    why: 'Demande du 28/09 (« prends les meilleures décisions »). Aucune migration d’URL, toute l’autorité du domaine partagée, et chaque texte anglais modifié est détecté comme à retraduire (clé = texte source).',
    where: ['docs/PLAN-I18N.md', 'src/i18n/', 'src/middleware.ts', 'src/pages/[lang]/[...path].astro', 'astro.config.mjs (sitemap, redirection)'],
  },
  {
    id: 'i18n-auto-redirect',
    sprint: 4,
    title: 'Langue automatique : redirection 307 depuis les pages anglaises seulement',
    choice:
      'Fonction edge Vercel (scripts/vercel-i18n-middleware.mjs) : pays de l’IP (x-vercel-ip-country), départagé par la langue du navigateur en Belgique, Suisse et Luxembourg ; un navigateur réglé en anglais dans ces pays reste en anglais ; un navigateur fr, de ou nl hors de ces pays est redirigé. Jamais pour les robots et aperçus de liens, jamais depuis une page déjà traduite, jamais en navigation interne, jamais si le cookie kosmo_lang (sélecteur) dit anglais ; ?lang=en force l’anglais. UTM et ?company= conservés.',
    why: 'Demande « langue automatique selon l’IP » tout en laissant Googlebot (qui crawle depuis les États-Unis) voir toutes les versions : c’est la façon de rediriger sans nuire à l’indexation.',
    where: ['src/i18n/config.ts (COUNTRY_LANGS)', 'scripts/vercel-i18n-middleware.mjs', 'src/components/ui/LangSwitch.astro', 'src/scripts/lang-switch.ts'],
  },
  {
    id: 'i18n-tone',
    sprint: 4,
    title: 'Ton et vocabulaire par langue',
    choice:
      'FR : vouvoiement, « panneau publicitaire 3D » (jamais « panneau 3D » seul). DE : « Sie », anglicismes métier conservés (3D-Billboard, 3D-DOOH, Screen). NL : « je », « 3D billboard » gardé en anglais (« 3D reclame » désigne les enseignes). Glossaire complet dans docs/i18n/GLOSSAIRE.md.',
    why: 'Recherche de mots-clés du 28/09 (docs/i18n/KEYWORDS.md, volumes estimés : l’API Ahrefs refuse les appels sur ce plan) et usages B2B de chaque marché.',
    where: ['docs/i18n/GLOSSAIRE.md', 'docs/i18n/KEYWORDS.md', 'src/i18n/dict/'],
  },
  {
    id: 'i18n-review',
    sprint: 4,
    title: 'Traductions publiées sans relecture native préalable',
    choice:
      'Les versions FR, DE et NL sont indexables dès leur mise en ligne. La relecture par un natif (FR en interne, DE et NL par un relecteur marketing B2B) est recommandée, en priorité sur la home, /3dooh, /fooh, /partners, /contact et les titres SEO.',
    why: 'Traductions faites avec glossaire, mots-clés et contrôles automatiques (repères, longueurs, doublons) : la qualité attendue est publiable ; attendre une relecture retarderait l’indexation de plusieurs semaines.',
    where: ['src/i18n/dict/fr', 'src/i18n/dict/de', 'src/i18n/dict/nl'],
  },
  {
    id: 'i18n-leads-language',
    sprint: 4,
    title: 'Leads en allemand et néerlandais',
    choice:
      'Chaque lead porte la langue de la page (hs_language dans HubSpot, ligne « Language » dans le résumé et Slack). Le JSON-LD ContactPoint continue d’annoncer en et fr seulement : les demandes DE et NL reçoivent une réponse en anglais tant que l’équipe ne parle pas ces langues. Prix partenaires gardés en dollars (fait confirmé), au format local (15 000 $, 15.000 $, $ 15.000).',
    why: 'Ne rien promettre que l’équipe ne peut pas tenir ; ne pas convertir un prix confirmé sans validation.',
    where: ['src/lib/lead.ts', 'src/lib/hubspot.ts', 'src/scripts/lead-form.ts', 'src/lib/seo.ts (contactPoint)'],
  },
  {
    id: 'media-owner-logos-by-language',
    sprint: 4,
    title: 'Bandeau des régies : une liste par langue (marché)',
    choice:
      'Le bandeau « media owners » affiche les régies du marché de la langue de la page (src/data/3dooh.ts → partners.markets). EN (international) : JCDecaux, Cityz Media, Phi advertising et iDOOH (réseaux, pas partenaires), puis Clear Channel Outdoor, Outfront, Lamar, Branded Cities, Sherwood (États-Unis), Ocean Outdoor, Global, Bauer Media Outdoor, blowUP media (Royaume-Uni), BackLite, Al Arabia, Hypermedia, Arabian Outdoor, Faden Media (Golfe). FR : JCDecaux, Cityz Media (ex-Clear Channel France), Mediatransports, Extime, Phenix Groupe, puis Bauer Media Outdoor Belgium, APG|SGA et Goldbach Neo (Suisse romande). DE : Ströer, blowUP media, JCDecaux (WallDecaux), Media Frankfurt, awk, Gewista, EPAMEDIA, APG|SGA, Goldbach Neo. NL : Ocean Outdoor, Global (ex-Exterion), Bauer Media Outdoor (ex-Clear Channel), JCDecaux, blowUP media, Publifer. Seules les régies dont on a le SVG officiel sont affichées ; une liste courte est répétée pour remplir le défilement. Clear Channel ne figure plus qu’en EN (activités France, Pays-Bas, Royaume-Uni et Suisse vendues en 2023–2025). iDOOH (Dubaï, confirmé par Mehdi le 29/09) en EN seulement, comme Phi advertising. Les pages villes suivent la langue, pas le pays de la ville.',
    why: 'Demande du 29/09. Listes établies par recherche web (ACPM DOOH Trust, communiqués Clear Channel, JCDecaux, Ströer, Bauer, Ocean, Multiply Media Group). Les SVG manquants n’ont pas pu être téléchargés (réseau de l’environnement fermé à Wikimedia et aux sites des régies) : voir assets-needed → media-owner-logos.',
    where: ['src/data/3dooh.ts (mediaOwners, partners.markets)', 'src/components/sections/Partners.astro', 'public/images/partners/*.svg'],
  },
  {
    id: 'main-cta-contact',
    sprint: 4,
    title: 'CTA principal : « Contact » vers /contact',
    choice:
      'Demande du 01/10 : le bouton principal devient « contact » (barre de navigation et son menu Services, hero de toutes les pages, pied de page, carte FAQ, bandeau des régies, barre CTA mobile, about, deck, pages services). « Get a free concept » reste en CTA secondaire là où le formulaire d’offre existe : hero de /3dooh et des pages villes (vers #offer, à la place de « book a call »), section écrans des villes, et le bloc concept (cas, projets FOOH, journal, deck, the shift). Le lien « Contact » de la navigation est retiré (doublon du bouton) ; « book a call » réapparaît dans la navigation des versions traduites, qui a maintenant la place. Sur /contact et /partners, le CTA pointe vers le formulaire de la page (#brief, #enquiry).',
    why: 'Un seul CTA principal, clair, qui mène à tous les canaux (formulaire, call, WhatsApp, email). Le concept gratuit garde sa place sur les pages 3DOOH, où il est proposé avec son formulaire.',
    where: ['src/data/site.ts (ctaLabel, ctaHref, conceptLabel, nav)', 'src/components/layout/Nav.astro', 'src/components/layout/Footer.astro', 'src/components/ui/MobileCtaBar.astro', 'src/pages/3dooh.astro', 'src/pages/3dooh/[city].astro'],
  },
  {
    id: 'miele-in-situ',
    sprint: 4,
    title: 'Miele HydroClean : photos en situation et liste des lieux',
    choice:
      'Photos fournies le 01/10 : quatre retenues (Digital Dream ×2 et Business Wall à Westfield Les 4 Temps, Cap 3000 près de Nice), dans la galerie du cas (/work/miele-hydroclean, rubrique « On the screens », à la place de deux captures du film) et trois dans l’article du journal (nouvelle section « Where it ran »). Liste des villes et écrans tirée de la matrice des specs (avril) et du récapitulatif Showcase N°1 (juin) du Drive ; « 81 écrans, 76 villes » conservé (deck et film de la campagne), la liste est présentée comme les principaux lieux. La photo du couloir du Business Wall n’a pas été reçue en fichier.',
    why: 'Demande du 01/10 : une ou deux photos par lieu, et préciser toutes les villes et écrans de la campagne.',
    where: ['src/content/cases/miele-hydroclean.md', 'src/content/posts/miele-hydroclean-case-study.md', 'public/images/journal/miele-hydroclean-*.jpg'],
  },
  {
    id: 'captcha-turnstile',
    sprint: 4,
    title: 'Captcha des formulaires : Cloudflare Turnstile',
    choice:
      'Cloudflare Turnstile sur les deux composants de formulaire (FreeConceptForm : concept gratuit, contact, offre des pages villes ; EmailGateForm : checklist, partenaires), en apparence « always » (boîte Cloudflare visible avec la coche « Succès » ; le mode invisible a été essayé puis abandonné le 04/10 parce qu’on ne voyait pas la protection), thème sombre, langue automatique. Vérification côté serveur dans /api/lead à chaque envoi (étape 1 comprise), jeton réarmé après chaque envoi. Deux variables : PUBLIC_TURNSTILE_SITE_KEY (widget) et TURNSTILE_SECRET_KEY (vérification). Sans elles, rien ne change : pas de widget, pas de vérification. Le honeypot reste. Mention ajoutée dans la politique de confidentialité, traduite en FR, DE, NL.',
    why: 'Demande du 04/10. Turnstile plutôt que reCAPTCHA : gratuit, sans cookie de suivi (pas de consentement à demander), pas de puzzle dans la grande majorité des cas, donc pas de perte de conversion. Les clés doivent être créées par Mehdi dans le tableau de bord Cloudflare (domaine kosmocgi.com) puis saisies dans Vercel.',
    where: ['src/components/ui/Captcha.astro', 'src/scripts/lead-form.ts', 'src/pages/api/lead.ts', 'src/lib/captcha.ts', 'src/lib/env.ts', 'src/data/env-registry.ts', 'src/data/legal.ts'],
  },
  {
    id: 'corner-screen-figure',
    sprint: 4,
    title: 'Trois formats : figures interactives au trait à la place des illustrations en pointillés',
    choice:
      'Demandes du 05/10. Les trois cartes de la section « Three ways to break the screen » de /3dooh ont chacune une figure Hairline : une tour avec écran d’angle (popout), un écran plat sur un quai avec voies (flatpop), un téléphone sur un socle carrelé (phonepop). Même geste partout : le cube sort de l’écran à mesure que le pointeur s’en approche, il est à moitié sorti au repos. Les images en pointillés restent affichées tant que le script n’a pas tourné. Au trait, en noir et gris de la charte sur fond blanc, sans accent acide. Composants HairlineFigure (une figure) et HairlineRuntime (le moteur, une fois par page) : pas d’équivalent dans /reference, ce sont des dessins interactifs.',
    why: 'La carte 01 a été validée en ligne le 05/10, puis demande de faire pareil pour les cartes 02 et 03, pour que la section reste cohérente. Pour revenir aux images : retirer `live` des entrées dans src/data/formats.ts.',
    where: ['src/data/formats.ts → items[].live', 'src/components/ui/HairlineFigure.astro', 'src/components/ui/HairlineRuntime.astro', 'src/components/sections/Formats.astro', 'public/hairline/', 'src/styles/tokens.css → --hairline-*'],
  },
  {
    id: 'facts-2026-10-05',
    sprint: 4,
    title: 'Faits invalidés le 05/10 : prix plancher, régies partenaires, call de 15 min, 3B+, entités',
    choice:
      'Prix : « from $15,000 per asset » retiré (articles prix, explainer, marque blanche, comparatif, /partners) ; à la place « pas de prix fixe par asset, devis selon resizing, écrans et formats ». L’article prix donne un repère « autour de 40 000 € » pour les campagnes visées (fait validé, formulé comme repère, pas comme plancher). Régies : plus aucune présentée comme partenaire (deck, /careers, llms.txt, article « choisir une agence ») ; JCDecaux, Clear Channel, Ströer… restent cités comme exemples de réseaux, et l’achat média par KOSMO® est ajouté (FAQ passée en fait confirmé, deck, Dubaï, articles prix et agence). Offre : plus de « call de 15 min » (contact, articles, checklist PDF qui disait aussi « 72h » et hello@) ; le concept gratuit reste en CTA secondaire, l’article prix renvoie d’abord vers /contact. 3B+ : n’est plus en tête (meta de la home, preuve du hero /3dooh, /about et /partners, intro carte du monde et travaux remplacés par « 150+ campaigns in 14 countries » / « 750+ screens » ; passé en dernier dans la bande de chiffres ; titre de l’article social sans 3B+) ; il reste sur /fooh, /careers et dans les articles FOOH. Entités et ancrage : footer « © KOSMO® », plus de KOSMO CGI SAS sur /careers ni dans llms.txt, plus de « home city » Paris ni d’« entité à Dubaï » (pages villes Paris, Dubaï, Riyad, article meilleures villes, contact « Remote team · worldwide », alt du drapeau). Conservé : mentions légales, confidentialité, JSON-LD Organization (legalName + SIREN).',
    why: 'Faits invalidés par Mehdi le 05/10 (CLAUDE.md). Les versions FR, DE, NL sont réécrites en copywriting adapté, pas traduites mot à mot.',
    where: ['src/content/posts/*.md', 'src/data/faq.ts', 'src/data/deck.ts', 'src/data/partners.ts', 'src/data/cities.ts', 'src/data/3dooh.ts', 'src/data/world.ts', 'src/data/home.ts', 'src/data/stats.ts', 'src/data/site.ts', 'src/data/contact-page.ts', 'src/pages/careers.astro', 'src/pages/llms.txt.ts', 'scripts/build-checklist-pdf.mjs', 'docs/CLAIMS.md'],
  },
  {
    id: 'journal-seo-2026-10-12',
    sprint: 4,
    title: 'Journal : réécriture SEO des 13 guides, illustrations Higgsfield',
    choice:
      'Chaque guide vise un groupe de requêtes Google réelles (autocomplétion US du 12/10, docs/SEO-KEYWORD-MAP.md) : FOOH / fake out of home, anamorphic billboard, 3D DOOH + DOOH meaning, 3D billboard cost, 3D billboard agency, famous 3D billboards, formats d’écran, DOOH specs, production, idées de lancement, 3D vs classique, viralité, marque blanche. Réponse directe en tête, FAQ en fin (balisée FAQPage en JSON-LD), CTA Contact puis concept gratuit, date « Updated ». Faits externes vérifiés et sourcés ; faits KOSMO limités à la liste validée. Projets restreints de projects.json (Squid Game, Asus, Pringles, Bose) non cités ; projets autoproduits (Yoshi, iPhone) présentés comme tels. Couvertures et schémas : illustrations générées avec Higgsfield (GPT Image 2.5) dans le style pointillé des visuels formats + cube jaune acide, sans marque ni lieu réel. Article marque blanche : « par défaut votre nom sur le travail », « on peut rejoindre un call si vous le voulez », « un média peut revendre la production », « FOOH aussi en marque blanche » restent à confirmer (repris de /partners).',
    why: 'Demande du 12/10 : être premier sur les mots-clés qui amènent des leads, en commençant par les articles existants, avec des images Higgsfield.',
    where: ['src/content/posts/*.md', 'public/images/journal/*-cover.jpg', 'src/lib/faq.ts', 'src/pages/journal/[slug].astro', 'src/styles/global.css (tableaux, h3)', 'docs/SEO-KEYWORD-MAP.md'],
  },
  {
    id: 'industries-visuals-2026-10-12',
    sprint: 4,
    title: 'Section « Industries » de la home : visuels Higgsfield « flash de nuit »',
    choice:
      'Direction choisie par Mehdi le 12/10 parmi trois essais (après rejet des écrans 3D dans la rue et des rendus CGI studio) : photos argentiques de nuit au flash direct, style magazine indépendant, un objet par industrie, sans marque, sans texte, sans personne. Prompts écrits comme un brief photo (Contax T2, Portra 800, une seule lumière, défauts visibles) au lieu de mots du type « hyperreal / cinematic / Octane », qui donnent le look IA. Modèle Nano Banana 2.1, 2K, exporté en 720×900. La section garde ses 4 cartes (mise en page de la référence) : retail (sneakers), luxe (parfum), automobile (voiture), divertissement (cinéma). Gaming (manette) et F&B (burger) sont prêts dans le même dossier pour un échange. Choix des 4 industries non validé.',
    why: 'Demande du 12/10 : une image par industrie générée avec Higgsfield, « un truc stylé, même sans montrer un écran », pas d’AI slop. Le badge DÉMO de la section est retiré (le visuel par industrie attendu est livré).',
    where: ['src/data/3dooh.ts → industries.images', 'public/images/industries/*.jpg', 'src/pages/index.astro'],
  },
  {
    id: 'journal-seo-wave2-2026-10-12',
    sprint: 4,
    title: 'Journal : vague SEO 2, cinq nouveaux articles',
    choice:
      'Nouveaux articles : what-is-dooh (DOOH meaning), dooh-advertising-cost (prix média, chiffres AdQuick / Place Exchange datés et attribués), fake-out-of-home-examples (18 exemples tiers sourcés + travaux KOSMO), anamorphic-screen, cgi-ads. Pour éviter la cannibalisation : what-is-3dooh recentré sur la 3D, liens ajoutés depuis what-is-fooh, 3d-billboard-cost et les articles anamorphic. Photo Miele « mall » écartée (filigrane Cityz Media).',
    why: 'Demande du 12/10 : lancer la prochaine vague d’articles (docs/SEO-KEYWORD-MAP.md §4).',
    where: ['src/content/posts/*.md', 'src/i18n/slugs.ts', 'public/images/journal/*.jpg', 'docs/SEO-KEYWORD-MAP.md'],
  },
  {
    id: 'play-wireframe-2026-10-19',
    sprint: 4,
    title: 'KOSMO® PLAY : wireframe en français de la sous-agence de jeux de marque',
    choice:
      'Page /play écrite directement en français (exception à la règle « on écrit l’anglais ») : noindex, hors traduction (EN_ONLY dans src/i18n/routes.ts), hors sitemap, `lang="fr"`. Nom de travail « KOSMO® PLAY » et URL /play non validés. Nav, footer et barre mobile restent en anglais (composants communs). Après validation : réécrire la copy en anglais dans src/data/play.ts, retirer /play de EN_ONLY et de PRIVATE_PATHS, traduire FR / DE / NL par dictionnaire, enlever noindex.',
    why: 'Demande du 19/10 : « un wireframe en français avec le copywriting » avant la vraie page.',
    where: ['src/pages/play.astro', 'src/data/play.ts', 'src/i18n/routes.ts → EN_ONLY', 'astro.config.mjs → PRIVATE_PATHS'],
  },
  {
    id: 'play-offer-2026-10-19',
    sprint: 4,
    title: 'KOSMO® PLAY : contenu de l’offre à confirmer',
    choice:
      'Liste « tout est inclus » déduite de « clé en main » : concepts et game design, DA 2D / 3D, dev web et mobile, sons, tests, hébergement, règlement du jeu et RGPD, leads envoyés dans le CRM, kit de diffusion, dashboard, bilan, support. Canaux : pub sociale, email, site / appli, affichage et DOOH (QR code, lien avec les billboards 3D), packaging / magasin, événement. Démo offerte = un niveau jouable à la marque + lien à partager + proposition de déploiement et de budget. « On revient vers vous sous un jour ouvré » repris de /thank-you. Pas de délai de production ni de prix (FAQ : « pas de prix fixe »). Chiffres du tableau de bord fictifs, signalés à l’écran. Section exemples : trois cas fictifs (snacking, sport, beauté) marqués « Exemple fictif », visuels en placeholder, en attendant les vrais cas que Mehdi importe.',
    why: 'Le brief donne les trois étapes, le clé en main et la démo comme CTA ; le reste est une proposition de copy à valider.',
    where: ['src/data/play.ts → included, channels, offer, reporting, examples, faq'],
  },
  {
    id: 'play-form-2026-10-19',
    sprint: 4,
    title: 'KOSMO® PLAY : formulaire de démo, l’email en dernier',
    choice:
      'Cinq étapes : objectif, canaux (choix multiple), style de jeu, échéance, puis contact (marque, email pro, nom facultatif, détail facultatif). Contrairement aux autres formulaires du site, l’email arrive en dernier : quatre clics d’abord, la saisie quand le visiteur est engagé. Contrepartie : pas de capture partielle si le visiteur abandonne avant la fin. Barre de progression « création de votre démo » et cartouche d’aperçu remplie en direct. Envoi vers /api/lead avec le type « demo-game » ; les réponses sont résumées dans le champ message (HubSpot, Slack). Succès affiché sur place, en français (la page /thank-you est en anglais).',
    why: 'Demande du 19/10 : « un formulaire ultra interactif qui pousse à être rempli ».',
    where: ['src/components/play/PlayDemo.astro', 'src/scripts/play-form.ts', 'src/lib/lead.ts → FORM_KINDS', 'src/scripts/lead-form.ts → send'],
  },
  {
    id: 'play-visuals-2026-10-19',
    sprint: 4,
    title: 'KOSMO® PLAY : références jeu vidéo et pixel art',
    choice:
      'Références jeu vidéo limitées à ce qui explique l’offre : un mini-jeu jouable dans le hero (le produit lui-même, avec record en mémoire et message dès la deuxième partie), le process en « niveaux » avec barre de progression, la barre de chargement du formulaire, la cartouche d’aperçu. Visuels en pixel art (sprites de src/lib/play-sprites.ts) dans les couleurs de la charte, en prolongement des visuels bitmap de la référence (dither, carte du monde en pixels). Pas de photo générée à ce stade.',
    why: 'Demande du 19/10 : des références au jeu vidéo « mais pas de choses gratuites, il faut de la cohérence ».',
    where: ['src/lib/play-sprites.ts', 'src/components/ui/PixelSprite.astro', 'src/scripts/play-game.ts', 'src/styles/tokens.css → --play-*', 'src/scripts/motion-tokens.ts → play'],
  },
  {
    id: 'play-hero-violet',
    sprint: 4,
    title: 'KOSMO® PLAY : hero plein écran sur dégradé violet',
    choice:
      'Hero réduit au titre, au sous-titre, aux deux CTA et aux pastilles, en plein écran, sur le dégradé radial demandé (noir au centre haut → violet du snippet en bas et sur les bords). Le violet n’existe pas dans la charte : ajouté en token (--play-violet, --play-hero-bg), réservé à /play. Le mini-jeu passe dans une section « à vous de jouer » juste en dessous ; le CTA secondaire « essayer un mini-jeu » y mène.',
    why: 'Demande du 19/10 : « que la hero prenne toute la page », « juste un gros titre et un sous-titre court, les CTA et les pastilles », fond = snippet de dégradé fourni.',
    where: ['src/components/play/PlayHero.astro', 'src/components/play/PlayTry.astro', 'src/styles/tokens.css → --play-violet, --play-hero-bg'],
  },
  {
    id: 'netflix-below-2026-10-20',
    sprint: 4,
    title: 'Netflix Below : deux films FOOH et une étude de cas avec l’activation de Toronto',
    choice:
      'Série « below » de deux projets FOOH (Statue of Liberty, Niagara Falls), en tête de projects.json, datés du 12/10/2026 (date des reels). Le film sous-marin payant a été retiré le 20/10 : Netflix ne l’a finalement pas diffusé. Chiffres affichés : les vues des reels Netflix (56,8M sur @netflix, 456K sur @netflixca, captures du 20/10), dans un champ metrics.views libellé « Instagram views », pour ne pas les présenter comme de l’earned media. Étude de cas /journal/netflix-below-fooh avec les éléments de mi-parcours trouvés sur Slack (storyboard modifié, bateau gardé petit, temps de simulation et de rendu) et l’activation de Toronto : tentacule de 10 pieds modélisé par KOSMO®, imprimé et installé par Eat It Up Media, photos et vidéos fournies par Mehdi (sons retirés des vidéos). Seuls le bateau, les tentacules et l’eau sont décrits comme 3D.',
    why: 'Demandes du 20/10 : « ajoute le projet Netflix Below au site » (vidéos livrées, liens Instagram, Slack pour les éléments de mi-parcours), puis photos de Toronto, crédit Eat It Up Media et retrait du film sous-marin.',
    where: ['src/data/fooh/projects.json → below-*', 'src/lib/fooh.ts → metrics.views', 'src/content/posts/netflix-below-fooh.md', 'public/video/fooh/below-*', 'public/video/journal/below-toronto-*', 'public/images/journal/below-*'],
  },
  {
    id: 'miele-japan-2026-10-20',
    sprint: 4,
    title: 'Miele Japan : cas Shinjuku Wall 456 et étude de cas',
    choice:
      'Cas /work/miele-shinjuku (catégorie 3DOOH, format écran plat, ville Tokyo : il remonte en tête de /3dooh/tokyo) et étude de cas /journal/miele-japan-shinjuku-wall-456. Écran annoncé à 45,6 m (fiche Panasonic et specs du projet ; Mehdi avait dit 42 m puis a validé 45,6 m). Trois chiffres affichés, tous factuels : 45,6 m, 3 formats, 100 % de part de voix du 31/08 au 06/09. Aucun chiffre d’audience : il n’en existe pas dans les sources. Les vidéos du 01/09 envoyées par Miele « for reference and viewing only » sont publiées avec l’accord explicite de Mehdi (20/10). Photos officielles de Miele du 13/09. Le modèle de page cas accepte maintenant un libellé par vidéo (videos.*.label) : ici « The 39 pillar screens » et « In the Yamanote Line trains » à la place de « Social version » et « Behind the scenes ». Montants, litiges et remarques internes du projet : jamais publiés.',
    why: 'Demande du 20/10 : « un bel article et page projet qui met en avant l’unicité de l’écran de Shinjuku et des resizing sur différents formats », informations à trouver dans les mails, l’export WhatsApp et Slack.',
    where: ['src/content/cases/miele-shinjuku.md', 'src/content/posts/miele-japan-shinjuku-wall-456.md', 'src/content.config.ts → video.label', 'src/pages/work/[slug].astro', 'public/images/journal/miele-japan-*', 'public/video/journal/miele-japan-*'],
  },
  {
    id: 'design-system-cofounder-2026-10-22',
    sprint: 4,
    title: 'Système de design « Cofounder » appliqué à tout le site',
    choice:
      'La maquette de la home validée le 21/10 (docs/exports/redesign-cofounder) devient la charte (DESIGN-SYSTEM.md) : papier F1F2F1, noir 1A1A1A, design à plat, rayons 4 px (2 px imbriqués), titres en capitales deux tons, étiquettes Inconsolata, boutons « Get started », lisières tramées et trame de points sur les sections sombres, nav fixe, nouveau footer. Toutes les pages gardent leurs sections, leur ordre et leurs textes ; seuls le style et les animations changent. Exceptions sur la home, reprises de la maquette : le showreel passe dans un mini lecteur du hero (plus de section Showreel), les pastilles du hero sont retirées, le modèle de campagne passe de quatre couches (courbe) à trois timbres (3DOOH, FOOH, PR), Industries devient un nuage de tags, la carte du monde a un bouton « Our work » à la place de son texte. Les autres pages qui utilisaient la courbe (ReachCurve) la gardent, au nouveau style.',
    why: 'Demande du 22/10 : appliquer la maquette Cofounder validée à tout le site, dans les quatre langues, sans réécrire le contenu.',
    where: ['DESIGN-SYSTEM.md', 'src/styles/tokens.css', 'src/scripts/motion-tokens.ts', 'src/components/**', 'src/data/home.ts'],
  },
  {
    id: 'tag-palette',
    sprint: 4,
    title: 'Palette des étiquettes et onglets hors charte',
    choice:
      'Onze couleurs reprises de la palette de référence de Mehdi (--tag-orange, --tag-red, --tag-pink, --tag-rose, --tag-amber, --tag-olive, --tag-green, --tag-sky, --tag-cream, --tag-blue, --tag-brown dans tokens.css), utilisées seulement par le nuage Industries et les onglets du dossier de la home. Hors de l’ancienne charte KOSMO® : à valider.',
    why: 'Présente dans la maquette validée, mais jamais validée comme couleurs de marque.',
    where: ['src/styles/tokens.css → --tag-*', 'src/components/sections/Industries.astro', 'src/components/sections/CampaignModel.astro'],
  },
  {
    id: 'home-talk-photo',
    sprint: 4,
    title: 'Photo de Mehdi sous le dossier de la home',
    choice: 'Recadrage carré en noir et blanc de public/images/about/mehdi.jpg (public/images/home/mehdi-face.jpg).',
    why: 'Repris de la maquette, où le recadrage n’a pas été validé.',
    where: ['src/data/home.ts → model.talk', 'public/images/home/mehdi-face.jpg'],
  },
  {
    id: 'anamorphic-services',
    sprint: 4,
    title: 'Services de la 3D anamorphique à la place des trois formats',
    choice:
      'Sur /3dooh et les pages villes, la section « Three ways to break the screen » (corner, flat, social) devient quatre services : Anamorphic billboards, In-store & retail, Events & experiential, Architecture & real estate, en cases à coin coupé (référence fournie par Mehdi) avec une figure Hairline chacune (deux nouvelles : storefront et stage). La case billboards mène à /work?category=3dooh, les trois autres à /contact en attendant leurs pages, qui restent à créer avec un projet réel chacune et des mots-clés à vérifier (Keyword Planner ou Google Trends).',
    why: 'Demande du 22/10 : présenter les services de la 3D anamorphique, chacun destiné à sa page et à ses recherches.',
    where: ['src/data/formats.ts', 'src/components/sections/Formats.astro', 'public/hairline/storefront.js', 'public/hairline/stage.js'],
  },
  {
    id: '3dooh-general-copy',
    sprint: 4,
    title: '/3dooh devient la page générale de la 3D anamorphique',
    choice:
      "Demande de Mehdi : /3dooh ne parle plus seulement de publicité DOOH. Nouvelle description SEO (le titre Google garde « 3D billboards », demandé par Mehdi avant la mise en ligne), hero, intro du 2D vs 3D (la ligne « budget média » devient « écran »), titre et intro du process, FAQ générale (quoi, où, quel écran, délai, prix, écrans, droits, IA, pays, marque blanche). Le formulaire « concept gratuit » (Offer, avec budget média) et le bandeau concept sous les services sont retirés de cette page, pour une future page dédiée (billboards / DOOH). Les pages villes gardent l'angle publicité. Le menu Services et la liste des services (About, home) appellent maintenant cette page « Anamorphic 3D ». Textes écrits sans validation de Mehdi.",
    why: 'Demande du 22/10 : la page doit couvrir la 3D anamorphique sur tout écran (rue, boutique, scène, bâtiment).',
    where: ['src/pages/3dooh.astro', 'src/data/3dooh.ts (anamorphic, shiftAnamorphic, processAnamorphic)', 'src/data/faq.ts (faqAnamorphic)', 'src/data/site.ts', 'src/data/about.ts'],
  },
  {
    id: 'fooh-spark-compare',
    sprint: 4,
    title: 'Avant / après de /fooh : effet « Compare » d’Aceternity',
    choice:
      'Demande de Mehdi (22/10) : l’effet ASCII est retiré, remplacé par un port sans React du composant « Compare » (ligne, halos, étincelles, poignée blanche), valeurs relevées sur le composant d’origine. Écarts : l’indigo devient l’acide de la charte (demande de Mehdi), le cyan du halo central aussi (mélangé au jaune, il donnait du vert), et les coins restent à 4 px au lieu de 16 px.',
    why: 'Mehdi veut un rendu ressemblant à l’original.',
    where: ['src/components/ui/SparkCompare.astro', 'src/scripts/spark-compare.ts', 'src/styles/tokens.css (--spark-*)'],
  },
  {
    id: 'anamorphic-service-pages',
    sprint: 4,
    title: 'Pages des quatre services de la 3D anamorphique',
    choice:
      "Demande de Mehdi (22/10) : une page par service, /3dooh/billboards, /3dooh/in-store, /3dooh/events, /3dooh/architecture (slugs traduits en FR / DE / NL), sur un modèle commun fait de sections existantes : hero photo, logos, trois lieux en cases à coin coupé, projets anamorphiques publiés, chiffres, carte (billboards), formes d'écran, méthode, témoignages, FAQ du service, contact. Chaque page répond au lecteur type et à sa crainte (validation de l'écran, petit écran en boutique, date d'événement, contenu qui vieillit). Pas encore de projet réel en retail, événementiel ou architecture : photos générées (Higgsfield), sans mention « concept » (demande de Mehdi). Textes et FAQ écrits sans validation. Mots-clés revus le 23/10 avec Semrush et validés par Mehdi : chaque page vise « contenu 3D pour <écran> » (les SERP des écrans seuls sont tenues par les fabricants). In-store : digital signage content (FR écran vitrine, DE Schaufenster Bildschirm, NL etalagescherm). Events : event LED screen (FR mur LED, DE LED Wand Messe, NL LED wall). Architecture : 3D LED display + naked eye 3D (FR écran 3D, DE Medienfassade, NL LED gevel). Détail : docs/i18n/KEYWORDS.md §3. Projection mapping écarté tant que KOSMO n'en fait pas. Les cases services de /3dooh et le pied de page mènent à ces pages. Ajout du 22/10 (Mehdi : pages trop légères) : une bande de chiffres de marché sourcés (Vistar Media × JCDecaux × Omnicom, Ocean Outdoor, sondage BCN Visuals × MFour, Exhibit Surveys via le CEIR ; études d'acteurs du secteur, citées comme telles, aucune étude indépendante sur l'anamorphique seul) et une méthode en quatre étapes avec les livrables, propres à chaque service. KOSMO n'a pas de chiffres à elle à publier pour l'instant. La mesure avant / après proposée en retail est une promesse de méthode à tenir.",
    why: 'Demande du 22/10 : des pages de sous-service pour chaque prospect, avec des images IA en attendant de vrais projets.',
    where: ['src/data/anamorphic-services.ts', 'src/data/faq.ts (faqServices)', 'src/components/layout/AnamorphicServicePage.astro', 'src/pages/3dooh/{billboards,in-store,events,architecture}.astro', 'public/images/services'],
  },
  {
    id: 'mobile-audit-2026-10-23',
    sprint: 4,
    title: 'Audit mobile : corrections et site plus court sur téléphone',
    choice:
      "Demande de Mehdi (23/10) : site irréprochable et plus compact sur mobile, sans toucher au copy ni à l'ordinateur. Tout est limité à ≤ 767 px ou aux écrans tactiles. Corrections : le nuage Industries ne bloque plus le défilement au doigt ; champs de formulaire à 16 px sur tactile (Safari iOS zoomait la page) ;  email de /contact coupé après « @ » ; hero en 100svh (barre d'adresse), boutons gardés au-dessus de la lisière tramée ; titre, ville et format des cartes projet affichés au tactile (ils n'existaient qu'au survol) ; témoignages au glissé ; menu mobile qui bloque la page derrière et se ferme d'un tap dehors ; « agrandir » du showreel en plein écran natif ; showreel mobile 854 × 480 (4,8 Mo au lieu de 12,8) ; affiches des 67 films de /work chargées à l'approche de l'écran. Compaction : rail horizontal au doigt, toutes les tuiles d'un rail à la même hauteur (cartes projet, quatre lieux, quatre formes, méthode, journal, audiences partenaires, galerie d'étude de cas), timbres du modèle de campagne couchés, logos sur 4 colonnes, films tramés des chiffres masqués, cartes contact compactes, footer en accordéons (colonne Follow masquée, doublon des icônes, logo KOSMO® de la bande en pleine largeur), sélecteur de langue du menu mobile en pleine largeur avec drapeaux, filtres de /work et /journal sur une ligne, dossiers de /contact sur 2 colonnes, fondateurs photo à gauche, titre d'About avant la photo. La barre CTA mobile se retire tant que les boutons du hero sont visibles. Retours de Mehdi sur la preview (23/10) : tableau 2D / 3D gardé en 3 colonnes à faire défiler (la version empilée était moins claire), flèche du bloc partenaires à droite du texte. Rapport : docs/screenshots/v18_2026-10-23_audit-mobile.",
    why: 'Pages de 12 000 à 16 000 px sur iPhone, plusieurs blocages tactiles et un tableau illisible : −19 % de hauteur en moyenne, desktop identique au pixel près (hors vidéos).',
    where: ['src/styles/global.css ([data-rail], champs tactiles)', 'src/styles/tokens.css (lot mobile)', 'src/components/ui/MosaicCard.astro, WorkRow.astro, MobileCtaBar.astro', 'src/components/layout/Footer.astro + src/scripts/footer-accordion.ts', 'src/scripts/hover-video.ts, hero-reel.ts, nav.ts, stagger-testimonials.ts, magnetic-tag-cloud.js'],
  },
  {
    id: 'city-pages-agency-first',
    sprint: 4,
    title: 'Pages villes v3 : l’agence d’abord, le guide local refait en blocs',
    choice:
      "Retour de Mehdi (23/10) : les pages villes se lisaient comme un article Wikipédia. Nouvel ordre : hero, bloc « ce qu’on fait pour vous à <ville> » (titre et intro réécrits par ville, mot-clé ville dans la 1re phrase, écrans nommés tirés du guide, trois points communs, Contact puis concept offert), réalisations, process, guide local, au-delà des billboards, témoignages, FAQ, autres villes, contact. L’ancien titre et chapeau « marché » ouvrent le guide (champs marketHeading / marketIntro, traductions inchangées). Shift (2D vs 3D) et Offer (formulaire concept) sont retirés des pages villes : le concept offert mène à /contact#brief. Guide : une seule mise en page retenue (blocs structurés + sommaire et règles en liste à cocher), sans variantes à choisir. Les éléments de liste gardent leur HTML (le moteur de traduction travaille sur le HTML rendu). Textes EN, FR, DE, NL écrits sans validation de Mehdi. Corrections de mise en page liées : étiquettes de format trop longues qui sortaient de l’écran (remplacées par des lignes étiquetées), carte noire de la FAQ qui passait sur le titre au défilement, double espacement des paragraphes du guide, bouton trop long à 360 px (libellé FR raccourci, libellé tronqué en dernier recours), vidéo verticale seule sur sa ligne dans la rangée de projets sur mobile (centrée, puis remplacée le 23/10 par le rail de l’audit mobile, décision mobile-audit-2026-10-23), bloc prix de Berlin étiqueté « écrans ».",
    why: 'Transformer le trafic des pages villes en prises de contact : le message agence doit arriver avant le guide.',
    where: ['src/pages/3dooh/[city].astro', 'src/components/sections/CityGuide.astro', 'src/content/cities/*.md', 'src/components/sections/Faq.astro', 'src/components/ui/{Button,WorkRow,MosaicCard}.astro', 'src/lib/city-guide.ts', 'docs/SEO-LOCAL-ARCHITECTURE.md §4 bis'],
  },
];
