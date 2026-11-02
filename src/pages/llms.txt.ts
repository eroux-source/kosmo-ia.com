/**
 * llms.txt du site IA (GEO) : qui est KOSMO® AI, faits vérifiables, chaque service avec sa définition et ses questions,
 * les productions IA et les pages clés. Texte brut, généré au build depuis src/data.
 */
import type { APIRoute } from 'astro';
import { services, serviceHref, home } from '../data/ai';
import { aiWorks, aiWorkHref } from '../data/ai-work';
import { SITE, LAST_UPDATED } from '../lib/seo';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('posts', ({ data }) => data.published)).sort((a, b) => a.data.title.localeCompare(b.data.title));
  const lines = [
    '# KOSMO® AI',
    '',
    `> KOSMO® AI is an AI creative agency and AI video production company. It produces AI commercials, TV spots, AI fashion films, UGC ads, music videos, explainer videos and AI influencers for brands, finished by a CGI and post-production team.`,
    '',
    `Last updated: ${LAST_UPDATED}`,
    '',
    '## Key facts',
    '- KOSMO® AI is the AI agency of KOSMO®, a CGI and mixed reality studio (KOSMO CGI SAS) founded by Eugène Roux and Mehdi Benkaci.',
    '- The KOSMO® studio has produced campaigns for Netflix, Zalando, Miele, Porsche, Renault, Uber Eats and Pringles.',
    '- 150+ campaigns delivered in 14 countries; 3B+ earned and owned media.',
    '- Projects run 3 to 4 weeks from an approved brief to delivery, with 2 rounds of revisions included.',
    '- Works worldwide and with US brands and agencies remotely.',
    `- Contact: ${SITE.email}, ${SITE.url}/contact`,
    '',
    '## Services',
    ...services.flatMap((s) => [
      '',
      `### ${s.label}`,
      `URL: ${SITE.url}${serviceHref(s)}`,
      s.intro.text[0],
      ...s.faq.map((q) => `- Q: ${q.question} A: ${q.answer}`),
    ]),
    '',
    '## Frequently asked questions',
    ...home.faq.map((q) => `- Q: ${q.question} A: ${q.answer}`),
    '',
    '## AI productions',
    ...aiWorks.map((w) => `- [${w.brand}: ${w.title}](${SITE.url}${aiWorkHref(w)}): ${w.subtitle} (${w.concept ? 'AI concept by KOSMO®' : 'AI production'}, ${w.format})`),
    '',
    '## Guides (blog)',
    ...posts.map((p) => `- [${p.data.title}](${SITE.url}/blog/${p.id}): ${p.data.excerpt}`),
    '',
    '## Pages',
    `- [Work](${SITE.url}/work): AI productions and studio films`,
    `- [Blog](${SITE.url}/blog): guides on AI commercials, AI video ads, UGC, AI influencers, lookbooks and music videos`,
    `- [Contact](${SITE.url}/contact): send a brief`,
    `- [Main KOSMO® studio site](https://www.kosmocgi.com): 3D billboards, FOOH and CGI`,
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
