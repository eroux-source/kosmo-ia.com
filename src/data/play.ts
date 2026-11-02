/**
 * KOSMO® PLAY : sous-agence de jeux de marque (page /play).
 * Wireframe en français, demandé par Mehdi le 19/10/2026 : la page reste en noindex et hors traduction tant que la copy
 * n'est pas validée. Ensuite : version anglaise (source du site), puis FR / DE / NL par dictionnaire (règle 6 de CLAUDE.md).
 * Cas réels : Mehdi les importera. La section « exemples » est un gabarit fictif, marqué comme tel à l'écran.
 * Nom de travail et choix non validés : décisions `play-*` dans src/data/decisions.ts.
 */

export const play = {
  meta: {
    title: 'KOSMO® PLAY · Jeux de marque clé en main',
    description:
      'KOSMO® PLAY crée des mini-jeux de marque jouables en un clic, dans une pub, un email, sur votre site ou via un QR code. Idée, production, reporting : tout est inclus. Démo jouable offerte.',
  },

  hero: {
    title: 'Des jeux à vos couleurs. Des leads à chaque partie.',
    subtitle: 'Des mini-jeux à votre marque, jouables en un clic dans une pub, un email ou via un QR code.',
    primary: { label: 'recevoir ma démo jouable', href: '#demo' },
    secondary: { label: 'essayer un mini-jeu', href: '#essayer' },
    chips: [
      { icon: 'play', label: 'Sans téléchargement' },
      { icon: 'phone', label: 'Pensé pour le mobile' },
      { icon: 'check', label: 'Clé en main' },
      { icon: 'shield-check', label: 'Conforme RGPD' },
    ],
  },

  /** Section « à vous de jouer », juste sous le hero : le mini-jeu jouable. */
  tryGame: {
    overline: 'KOSMO® PLAY · À vous de jouer',
    heading: 'Une partie vaut mieux qu’un long discours.',
    intro: 'Voici un jeu de marque en version démo. Jouez, rejouez, et regardez à quel moment la marque récupère l’email.',
  },

  /** Mini-jeu jouable (section « à vous de jouer ») : la démonstration du produit, sur la page même. Réglages : motion.play.game. */
  game: {
    ariaLabel: 'Mini-jeu de démonstration : attrapez les cubes avec le panier',
    title: 'Attrape les cubes',
    brand: 'Votre marque',
    instructions: 'Glissez le doigt ou la souris pour déplacer le panier. Évitez les pièges orange.',
    keys: 'Au clavier : flèches gauche et droite.',
    start: 'jouer',
    replay: 'rejouer',
    hud: { score: 'Score', time: 'Temps', best: 'Record' },
    over: {
      title: 'Partie terminée',
      newBest: 'Nouveau record',
      reward: 'Vous débloquez -10 %',
      email: 'votre@email.com',
      claim: 'Recevoir mon code',
      consent: 'J’accepte de recevoir les offres de la marque',
    },
    /** Affiché dès la deuxième partie : la page démontre la rétention sur le visiteur lui-même. */
    replayNudge: 'Vous rejouez. C’est exactement l’effet recherché.',
    callouts: [
      { title: 'Votre univers', text: 'Vos couleurs, vos produits, votre ton.' },
      { title: 'Un score à battre', text: 'Le joueur relance une partie, puis une autre.' },
      { title: 'Le lead, au bon moment', text: 'La récompense se débloque contre un email.' },
    ],
    previewNote: 'Aperçu : sur votre jeu, cet email part directement dans votre CRM.',
  },

  compare: {
    overline: 'Le constat',
    heading: 'On zappe une pub. On rejoue à un jeu.',
    intro:
      'Les pubs se zappent, les emails restent fermés, les pages défilent. Un jeu inverse le rapport : c’est votre public qui choisit de rester, de recommencer et de vous laisser ses coordonnées.',
    legend: 'Chaque case = un moment passé avec votre marque.',
    tracks: [
      { label: 'Format classique', steps: ['Vue', 'Scroll', 'Oublié'], end: 'Fin du contact', tone: 'muted' },
      {
        label: 'Jeu de marque',
        steps: ['Clic', '1re partie', 'Il rejoue', 'Record battu', 'Score partagé', 'Email laissé', 'Code utilisé'],
        end: 'Un client, pas une vue',
        tone: 'acid',
      },
    ],
    points: [
      { icon: 'play', title: 'Choisi, pas subi', text: 'On ne force pas l’attention : le joueur décide lui-même de lancer la partie.' },
      { icon: 'clock', title: 'Du temps avec la marque', text: 'Une partie se joue, se relance, se partage. Votre message a le temps de passer.' },
      { icon: 'coins', title: 'Un échange équitable', text: 'Le joueur donne son email contre un vrai gain : un code, un lot, une place au classement.' },
    ],
  },

  anatomy: {
    overline: 'Le produit',
    heading: 'Anatomie d’une partie',
    intro: 'Un jeu de marque, c’est un parcours court, pensé pour convertir. Cinq écrans, du premier clic au partage.',
    screens: [
      { label: 'Écran titre', title: 'Votre marque, dès la première seconde', text: 'Logo, univers, une phrase et un bouton : on comprend tout de suite.' },
      { label: 'La partie', title: 'Vos produits deviennent le jeu', text: 'Une prise en main immédiate, sans tutoriel, sur mobile comme sur ordinateur.' },
      { label: 'Le score', title: 'Un record à battre', text: 'Le score et le classement donnent envie de relancer une partie.' },
      { label: 'La récompense', title: 'Le joueur devient un lead', text: 'Pour récupérer son gain, il laisse son email et accepte vos communications.' },
      { label: 'Le partage', title: 'Il défie ses amis', text: 'Une carte de score à partager : chaque joueur en amène d’autres.' },
    ],
    mock: {
      brand: 'Votre logo',
      start: 'Jouer',
      score: 'Score',
      best: 'Record',
      rank: 'Classement',
      replay: 'Rejouer',
      reward: '-10 % débloqué',
      email: 'votre@email.com',
      claim: 'Recevoir',
      optin: 'Opt-in accepté',
      share: 'J’ai fait 24. Tu fais mieux ?',
      shareCta: 'Défier un ami',
    },
    features: [
      { icon: 'play', title: 'Jouable en un clic', text: 'Un lien ou un QR code, et la partie démarre. Pas d’appli, pas de compte à créer.' },
      { icon: 'cube-3d-sphere', title: 'En 2D ou en 3D', text: 'Notre studio CGI transforme vos produits, mascottes et décors en éléments de jeu.' },
      { icon: 'send', title: 'Branché à vos outils', text: 'Les emails et les réponses arrivent dans votre CRM ou votre outil d’emailing.' },
      { icon: 'trending-up', title: 'Mesuré de bout en bout', text: 'Joueurs, parties, temps de jeu, leads, partages, codes utilisés : tout est suivi.' },
    ],
  },

  channels: {
    overline: 'Diffusion',
    heading: 'Un seul jeu. Tous vos points de contact.',
    intro: 'Les joueurs arrivent de partout. Les leads arrivent chez vous.',
    hub: { label: 'Votre jeu', text: 'Un lien unique, jouable partout' },
    output: { label: 'Vos leads', text: 'Emails, réponses et consentements, envoyés dans votre CRM' },
    items: [
      { icon: 'play', title: 'Publicité sociale', text: 'Une pub qui se joue, en story ou dans le fil.' },
      { icon: 'mail', title: 'Email', text: 'Un visuel animé, le jeu à un clic. De quoi réveiller une base qui n’ouvre plus.' },
      { icon: 'device-screen', title: 'Site et appli', text: 'En page dédiée, en pop-in ou dans votre espace client.' },
      { icon: 'building-skyscraper', title: 'Affichage et DOOH', text: 'Un QR code sur l’affiche : le passant devient joueur. Idéal avec un billboard 3D KOSMO®.' },
      { icon: 'map-pin', title: 'Packaging et magasin', text: 'Un QR code sur le produit ou en rayon : le jeu au moment de l’achat.' },
      { icon: 'users', title: 'Événement', text: 'Sur borne ou sur écran géant, avec un classement en direct.' },
    ],
  },

  objectives: {
    overline: 'Objectifs',
    heading: 'On ne fait pas un jeu pour faire un jeu.',
    intro: 'On part de votre objectif, puis on choisit la mécanique qui le sert. Choisissez le vôtre.',
    labels: { mechanic: 'La mécanique', how: 'Comment ça marche', kpis: 'Ce qu’on mesure' },
    items: [
      {
        id: 'leads',
        icon: 'mail',
        sprite: 'gift',
        label: 'Générer des leads',
        mechanic: 'Récompense à débloquer',
        text: 'Le score débloque un code, un lot ou une participation au tirage. Pour le récupérer : un email et l’accord pour vos communications.',
        how: ['Il joue', 'Il débloque un gain', 'Il laisse son email'],
        kpis: ['Emails captés', 'Taux d’opt-in', 'Coût par lead'],
      },
      {
        id: 'retention',
        icon: 'heart',
        sprite: 'trophy',
        label: 'Fidéliser',
        mechanic: 'Défi régulier et classement',
        text: 'Un nouveau défi chaque semaine, un classement entre joueurs : on revient pour garder sa place.',
        how: ['Un nouveau défi sort', 'Le classement bouge', 'Il revient jouer'],
        kpis: ['Joueurs qui reviennent', 'Parties par joueur', 'Durée de vie du jeu'],
      },
      {
        id: 'awareness',
        icon: 'eye',
        sprite: 'star',
        label: 'Faire connaître la marque',
        mechanic: 'Score à partager',
        text: 'Chaque fin de partie crée une carte de score à partager, ou un défi à envoyer à un ami.',
        how: ['Il fait un score', 'Il défie un ami', 'Un nouveau joueur arrive'],
        kpis: ['Partages', 'Joueurs venus d’un partage', 'Temps passé avec la marque'],
      },
      {
        id: 'sales',
        icon: 'coins',
        sprite: 'coin',
        label: 'Booster les ventes',
        mechanic: 'Code promo gagné',
        text: 'La récompense se dépense en boutique ou en ligne : le jeu mène jusqu’à l’achat.',
        how: ['Il gagne un code', 'Il l’utilise', 'Vous voyez la vente'],
        kpis: ['Codes utilisés', 'Ventes attribuées', 'Panier moyen'],
      },
      {
        id: 'launch',
        icon: 'sparkles',
        sprite: 'cube',
        label: 'Lancer un produit',
        mechanic: 'Le produit en héros',
        text: 'Le joueur manipule votre nouveau produit et découvre ses atouts en jouant, pas en lisant.',
        how: ['Il découvre le produit', 'Il joue avec', 'Il retient ses atouts'],
        kpis: ['Temps de jeu', 'Parties terminées', 'Clics vers le produit'],
      },
      {
        id: 'data',
        icon: 'users',
        sprite: 'question',
        label: 'Mieux connaître vos clients',
        mechanic: 'Quiz et choix en jeu',
        text: 'Les réponses du joueur (goûts, besoins, profil) deviennent des données utiles pour vos prochaines campagnes.',
        how: ['Il répond en jouant', 'Il reçoit son profil', 'Vous créez des segments'],
        kpis: ['Réponses collectées', 'Segments créés', 'Profils enrichis'],
      },
    ],
  },

  formats: {
    overline: 'Formats',
    heading: 'Des jeux qu’on comprend sans tutoriel.',
    intro: 'Six familles de jeux, adaptées à votre marque. Ou un format sur mesure.',
    bestFor: 'Idéal pour',
    cta: { text: 'Pas sûr du format ? On vous le propose dans la démo.', label: 'recevoir ma démo jouable', href: '#demo' },
    items: [
      { id: 'arcade', sprite: 'joystick', title: 'Arcade', text: 'Attraper, esquiver, courir. Des parties courtes et un score à battre.', bestFor: ['Social', 'Leads'] },
      { id: 'quiz', sprite: 'question', title: 'Quiz et test de profil', text: 'On répond, on découvre son profil et le produit qui va avec.', bestFor: ['Données', 'Conseil produit'] },
      { id: 'instant', sprite: 'gift', title: 'Instant gagnant', text: 'Roue, grattage, coffre à ouvrir. Simple, immédiat, parfait en magasin et en email.', bestFor: ['Ventes', 'Magasin'] },
      { id: 'puzzle', sprite: 'puzzle', title: 'Puzzle et memory', text: 'Plus posé : le joueur passe du temps avec vos produits.', bestFor: ['Notoriété', 'Lancement'] },
      { id: 'calendar', sprite: 'calendar', title: 'Calendrier et défis', text: 'Une case par jour, un défi par semaine. La mécanique de fidélité par excellence.', bestFor: ['Fidélité', 'Temps forts'] },
      { id: '3d', sprite: 'cube', title: 'Jeu en 3D', text: 'Notre spécialité : votre produit en 3D, à explorer et à manipuler dans le navigateur.', bestFor: ['Lancement', 'Premium'] },
    ],
  },

  process: {
    overline: 'Comment ça marche',
    heading: 'Trois étapes. Vous validez, on fait le reste.',
    intro: 'Vous gardez la main sur les choix. On s’occupe de tout le travail.',
    labels: { level: 'Niveau', you: 'Vous', deliverable: 'Vous recevez', done: 'Terminé' },
    steps: [
      {
        icon: 'bulb',
        title: 'Propositions d’idées',
        text: 'On part de votre objectif, de votre cible et de vos canaux. Vous recevez plusieurs concepts de jeu, avec la mécanique, la récompense et la maquette des écrans.',
        you: 'Vous choisissez une idée.',
        deliverable: 'Concepts illustrés et plan de diffusion',
      },
      {
        icon: 'cube-3d-sphere',
        title: 'Production du jeu',
        text: 'Game design, graphismes 2D ou 3D, sons, développement, tests sur tous les téléphones, hébergement et conformité. Vous jouez à chaque version avant la mise en ligne.',
        you: 'Vous testez et validez.',
        deliverable: 'Le jeu en ligne, prêt à diffuser',
      },
      {
        icon: 'trending-up',
        title: 'Reporting',
        text: 'Un tableau de bord en direct pendant la campagne, puis un bilan complet : ce qui a marché, ce qu’on peut améliorer, la suite possible.',
        you: 'Vous récoltez les leads.',
        deliverable: 'Dashboard en direct et bilan de campagne',
      },
    ],
  },

  included: {
    overline: 'Clé en main',
    heading: 'Tout est inclus. Vous n’avez qu’à valider.',
    intro: 'Un seul interlocuteur, du premier croquis au bilan. Pas de prestataires à coordonner, pas de mauvaise surprise.',
    items: [
      'Concepts et game design',
      'Direction artistique 2D ou 3D',
      'Développement web et mobile',
      'Sons et musique',
      'Tests sur tous les appareils',
      'Hébergement et mise en ligne',
      'Règlement du jeu et RGPD',
      'Leads envoyés dans votre CRM',
      'Kit de diffusion : bannières, email, QR codes',
      'Tableau de bord en direct',
      'Bilan de campagne',
      'Support pendant toute la campagne',
    ],
    compare: {
      without: { label: 'Sans KOSMO® PLAY', items: ['Game designer', 'Graphiste 3D', 'Développeur', 'Hébergeur', 'Juriste', 'Analyste data'] },
      with: { label: 'Avec KOSMO® PLAY', text: 'Un seul interlocuteur' },
    },
  },

  reporting: {
    overline: 'Reporting',
    heading: 'Vous voyez tout. En direct.',
    intro: 'Chaque partie est mesurée. Vous suivez la campagne en temps réel et vous recevez un bilan clair à la fin.',
    points: ['Joueurs, parties et temps de jeu', 'Leads captés et taux d’opt-in', 'Partages et nouveaux joueurs', 'Codes utilisés et ventes attribuées'],
    dashboard: {
      title: 'Tableau de bord',
      campaign: 'Campagne exemple',
      live: 'En direct',
      note: 'Exemple, chiffres fictifs',
      kpis: [
        { label: 'Joueurs', value: 48210 },
        { label: 'Parties jouées', value: 163540 },
        { label: 'Emails captés', value: 12870 },
        { label: 'Partages', value: 6420 },
      ],
      chart: { label: 'Parties par jour', bars: [22, 35, 31, 48, 56, 52, 70, 64, 78, 95, 88, 100, 84, 91] },
      funnel: {
        label: 'Du jeu au lead',
        steps: [
          { label: 'Ont lancé le jeu', value: 100 },
          { label: 'Ont rejoué', value: 64 },
          { label: 'Ont débloqué la récompense', value: 41 },
          { label: 'Ont laissé leur email', value: 27 },
          { label: 'Ont utilisé leur code', value: 11 },
        ],
      },
    },
  },

  /** Gabarit en attendant les vrais cas (Mehdi les importe) : contenus fictifs, marqués « Exemple fictif » à l'écran. */
  examples: {
    overline: 'Exemples',
    heading: 'Ce que ça peut donner',
    intro: 'Trois exemples pour se projeter. Les vrais cas arrivent bientôt.',
    note: 'Exemple fictif',
    labels: { objective: 'Objectif', game: 'Le jeu', channels: 'Diffusion', results: 'Résultats' },
    metrics: ['Joueurs', 'Emails captés', 'Temps de jeu moyen'],
    pending: 'À venir',
    items: [
      {
        sector: 'Marque de snacking',
        title: 'Le jeu sur le paquet',
        objective: 'Générer des leads',
        game: 'Arcade : attraper les chips qui tombent, éviter les miettes. Le score débloque un bon de réduction.',
        channels: ['QR code sur le pack', 'Pub sociale'],
        visual: 'play-example-snacking',
      },
      {
        sector: 'Enseigne de sport',
        title: 'Le défi de la semaine',
        objective: 'Fidéliser',
        game: 'Un nouveau défi chaque lundi, un classement entre clubs, un lot pour le premier du mois.',
        channels: ['Email', 'Appli'],
        visual: 'play-example-sport',
      },
      {
        sector: 'Marque de beauté',
        title: 'Le quiz de la routine',
        objective: 'Mieux connaître ses clientes',
        game: 'Un quiz en cinq questions qui révèle le type de peau et recommande la routine qui va avec.',
        channels: ['Site', 'Magasin'],
        visual: 'play-example-beauty',
      },
    ],
  },

  offer: {
    overline: 'Démo offerte',
    heading: 'Jouez à votre propre jeu avant de vous engager.',
    intro:
      'Cinq questions, une minute. On vous renvoie une démo jouable à vos couleurs : un niveau, votre logo, vos produits et la mécanique qui sert votre objectif.',
    receive: {
      label: 'Ce que vous recevez',
      items: ['Une démo jouable sur mobile, à votre image', 'Un lien à partager en interne', 'Une proposition de déploiement et de budget'],
    },
    reassurance: 'Gratuit et sans engagement. On revient vers vous sous un jour ouvré.',
  },

  form: {
    progress: 'Création de votre démo',
    step: 'Étape',
    of: 'sur',
    back: 'retour',
    next: 'continuer',
    submit: 'recevoir ma démo jouable',
    multiHint: 'Plusieurs choix possibles',
    steps: [
      {
        name: 'objective',
        type: 'single',
        question: 'Quel est votre objectif principal ?',
        options: [
          { value: 'Générer des leads', icon: 'mail' },
          { value: 'Fidéliser', icon: 'heart' },
          { value: 'Faire connaître la marque', icon: 'eye' },
          { value: 'Booster les ventes', icon: 'coins' },
          { value: 'Lancer un produit', icon: 'sparkles' },
          { value: 'Mieux connaître mes clients', icon: 'users' },
        ],
      },
      {
        name: 'channels',
        type: 'multi',
        question: 'Où le jeu sera-t-il joué ?',
        options: [
          { value: 'Pub sociale', icon: 'play' },
          { value: 'Email', icon: 'mail' },
          { value: 'Site ou appli', icon: 'device-screen' },
          { value: 'Affichage et DOOH', icon: 'building-skyscraper' },
          { value: 'Packaging et magasin', icon: 'map-pin' },
          { value: 'Événement', icon: 'users' },
        ],
      },
      {
        name: 'genre',
        type: 'single',
        question: 'Quel style de jeu vous tente ?',
        options: [
          { value: 'Arcade', sprite: 'joystick' },
          { value: 'Quiz', sprite: 'question' },
          { value: 'Instant gagnant', sprite: 'gift' },
          { value: 'Puzzle', sprite: 'puzzle' },
          { value: 'Calendrier', sprite: 'calendar' },
          { value: 'Jeu en 3D', sprite: 'cube' },
          { value: 'Surprenez-moi', sprite: 'star' },
        ],
      },
      {
        name: 'timing',
        type: 'single',
        question: 'Pour quand ?',
        options: [
          { value: 'Dans le mois', icon: 'clock' },
          { value: 'Dans 1 à 3 mois', icon: 'calendar' },
          { value: 'Dans 3 à 6 mois', icon: 'hourglass' },
          { value: 'Pas encore de date', icon: 'bulb' },
        ],
      },
      { name: 'contact', type: 'fields', question: 'À qui envoie-t-on la démo ?', options: [] },
    ],
    fields: {
      company: { label: 'Marque ou société', placeholder: 'Le nom de votre marque' },
      email: { label: 'Email pro', placeholder: 'vous@marque.com' },
      name: { label: 'Prénom et nom', placeholder: 'Camille Martin' },
      message: { label: 'Un détail à ajouter ?', placeholder: 'Produit à mettre en avant, cible, récompense, date de lancement…' },
    },
    errors: {
      required: 'Ce champ est obligatoire',
      email: 'Entrez une adresse email valide',
      choose: 'Choisissez au moins une option',
      captcha: 'Validez la vérification de sécurité, puis réessayez.',
      server: 'Un problème est survenu. Écrivez-nous à contact@kosmocgi.com.',
    },
    done: {
      title: 'C’est dans la boîte.',
      text: 'On a tout ce qu’il faut pour fabriquer votre démo. On revient vers vous sous un jour ouvré.',
      book: 'réserver un call',
    },
    /** Cartouche : aperçu en direct de la démo, rempli à chaque réponse. */
    cartridge: {
      brandFallback: 'Votre marque',
      subtitle: 'Le jeu',
      rows: { objective: 'Objectif', channels: 'Joué via', genre: 'Style', timing: 'Lancement' },
      empty: 'à choisir',
      status: { building: 'Démo en préparation', ready: 'Prête à fabriquer', sent: 'En fabrication' },
    },
  },

  faq: {
    overline: 'Questions fréquentes',
    heading: 'Les questions qu’on nous pose.',
    card: { title: 'Une autre question ?', text: 'Écrivez-nous. On répond sous un jour ouvré, en français ou en anglais.' },
    cta: { label: 'recevoir ma démo', href: '#demo' },
    items: [
      {
        question: 'Faut-il télécharger une application ?',
        answer: 'Non. Le jeu s’ouvre dans le navigateur, sur mobile comme sur ordinateur, depuis un lien, un QR code ou une intégration sur votre site.',
      },
      {
        question: 'Combien de temps faut-il pour produire un jeu ?',
        answer: 'Ça dépend du format, du nombre de niveaux et des graphismes. Vous recevez un calendrier précis avec les propositions d’idées, avant de lancer la production.',
      },
      {
        question: 'Combien ça coûte ?',
        answer: 'Il n’y a pas de prix fixe : le budget dépend du type de jeu, des graphismes (2D ou 3D), de la durée de la campagne et des intégrations. La démo est offerte, et le devis arrive avec les concepts.',
      },
      {
        question: 'Que deviennent les données des joueurs ?',
        answer: 'Elles vous appartiennent. On ne collecte que ce qui est utile, avec un consentement clair, et on les envoie dans votre CRM ou en export. Le jeu est conforme au RGPD.',
      },
      {
        question: 'On n’a pas d’idée de jeu. C’est un problème ?',
        answer: 'Non, c’est notre travail. Donnez-nous votre objectif et votre cible : on vous propose les idées.',
      },
      {
        question: 'Peut-on réutiliser le jeu ensuite ?',
        answer: 'Oui. Nouveaux niveaux, nouvelle saison, nouvelle récompense : le même jeu peut vivre plusieurs campagnes.',
      },
      {
        question: 'La démo est vraiment gratuite ?',
        answer: 'Oui, sans engagement. Elle sert à vous montrer, manette en main, ce que votre jeu peut donner.',
      },
    ],
  },
};

export type PlayFormStep = (typeof play.form.steps)[number];
