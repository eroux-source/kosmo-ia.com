/** llms.txt du site IA : présentation, services et pages clés, pour les moteurs de réponse (GEO). */
import type { APIRoute } from 'astro';
import { services, serviceHref, home } from '../data/ai';
import { SITE } from '../lib/seo';

export const GET: APIRoute = () => {
  const lines = [
    '# KOSMO® AI',
    '',
    `> ${home.seo.description}`,
    '',
    'KOSMO® AI is the AI creative agency of KOSMO®, a CGI and mixed reality studio that has produced campaigns for Netflix, Zalando, Miele, Porsche, Renault, Uber Eats and Pringles. Projects run 3 to 4 weeks from an approved brief, with 2 rounds of revisions included.',
    '',
    '## Services',
    ...services.map((s) => `- [${s.label}](${SITE.url}${serviceHref(s)}): ${s.blurb}`),
    '',
    '## Pages',
    `- [Work](${SITE.url}/work): films produced by the KOSMO® studio`,
    `- [Contact](${SITE.url}/contact): send a brief, ${SITE.email}`,
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
