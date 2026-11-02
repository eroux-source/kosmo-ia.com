/**
 * Page /careers. Les postes et les avantages sont rédigés (DÉMO) : à valider ou remplacer.
 * Les chiffres, l'équipe et les marques viennent des fichiers déjà confirmés (stats, 3dooh.team, site.brands).
 */
export const careersEmail = 'career@kosmocgi.com';

export interface Job {
  demo: boolean;
  id: string;
  title: string;
  team: string;
  type: string;
  location: string;
  summary: string;
}

export const careers = {
  seoTitle: 'Careers at KOSMO®: remote jobs in 3D and mixed reality',
  seoDescription: 'Join the studio behind 3B+ earned and owned media. Every role is remote. Send your application to career@kosmocgi.com.',
  overline: 'careers',
  heading: { demo: true, text: 'Work on the screens people film.' },
  intro: {
    demo: true,
    text: 'KOSMO® is a small, fully remote studio. We make 3D billboards and mixed-reality films for brands, then cut them for the feed. If you like real craft and fast projects, read on.',
  },
  perks: {
    demo: true,
    items: [
      { icon: 'world', title: 'Remote, always', text: 'Every role is remote. Work from where you do your best work; we meet on calls and once a year in person.' },
      { icon: 'clock', title: 'Short projects', text: 'A campaign takes 3 to 4 weeks. You see your work on a screen in a real city, not in a backlog.' },
      { icon: 'trending-up', title: 'Work that travels', text: '3B+ earned and owned media. What you make gets filmed, posted and shared.' },
      { icon: 'users', title: 'A senior team', text: 'Seven people, no layers. You talk to the creative director, the production lead and the founders every week.' },
      { icon: 'device-screen', title: 'The tools you need', text: 'Software licences, a proper machine and render credits are on us.' },
      { icon: 'calendar', title: 'Time off that exists', text: 'Five weeks of paid leave, public holidays where you live, and no calls after your working hours.' },
    ],
  },
  jobs: [
    {
      demo: false,
      id: 'sales-ooh-dooh',
      title: 'Senior Sales Executive, OOH & DOOH',
      team: 'Business development',
      type: 'Full time',
      location: 'Remote',
      summary: 'Sell ambitious 3D billboard campaigns, creative and media buy included, to big brands and their agencies. You have years of OOH or DOOH sales behind you, you know how screens are planned and bought, and your network takes your calls.',
    },
    {
      demo: true,
      id: 'senior-3d-generalist',
      title: 'Senior 3D Generalist',
      team: 'Production',
      type: 'Full time',
      location: 'Remote',
      summary: 'Model, shade, light and render anamorphic scenes for corner and flat screens. Cinema 4D or Blender, Redshift or Octane, Unreal a plus.',
    },
    {
      demo: true,
      id: 'compositing-artist',
      title: 'Compositing & VFX Artist',
      team: 'Production',
      type: 'Full time',
      location: 'Remote',
      summary: 'Integrate 3D into real street footage: tracking, roto, colour, grain. Nuke or After Effects. You make mixed reality look real.',
    },
    {
      demo: true,
      id: 'motion-designer',
      title: 'Motion Designer, social cuts',
      team: 'Content',
      type: 'Full time',
      location: 'Remote',
      summary: 'Turn campaign films into vertical cuts that stop a thumb. Rhythm, type, sound. You know what performs on TikTok and Instagram.',
    },
    {
      demo: true,
      id: 'producer',
      title: 'Producer, 3DOOH campaigns',
      team: 'Production',
      type: 'Full time',
      location: 'Remote',
      summary: 'Run three to five campaigns at a time: briefs, media owner specs, deadlines, approvals. Calm, precise, bilingual in French and English.',
    },
    {
      demo: true,
      id: 'account-manager',
      title: 'Account Manager, brands & agencies',
      team: 'Accounts',
      type: 'Full time',
      location: 'Remote',
      summary: 'Own a portfolio of brand and agency clients from first call to renewal. You have sold creative or media before and are comfortable on the phone.',
    },
    {
      demo: true,
      id: 'internship-3d',
      title: '3D Artist, internship',
      team: 'Production',
      type: 'Internship, 6 months',
      location: 'Remote',
      summary: 'Assist the 3D team on real campaigns from week one. Paid, with a mentor and a portfolio at the end.',
    },
  ] satisfies Job[],
  apply: {
    demo: true,
    heading: 'How to apply',
    steps: [
      'Email career@kosmocgi.com with the role in the subject line.',
      'Attach a short note (why this role, why now) and a link to your work.',
      'We reply within five working days. First call is 30 minutes.',
      'Second step is a paid test on a real brief, then an offer.',
    ],
  },
};
