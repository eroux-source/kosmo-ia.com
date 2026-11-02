/**
 * FAQ d'un article du journal → JSON-LD FAQPage. Source : la section « ## FAQ » du Markdown rendu
 * (chaque « ### Question? » suivi de ses paragraphes), pour que les textes soient ceux de la page (guillemets typographiques compris).
 */
const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
const text = (html: string) => decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqFromHtml(html: string | undefined): FaqItem[] {
  if (!html) return [];
  const start = html.search(/<h2[^>]*>\s*FAQ\s*<\/h2>/i);
  if (start < 0) return [];
  const rest = html.slice(start).replace(/^<h2[^>]*>[\s\S]*?<\/h2>/i, '');
  const section = rest.split(/<h2[\s>]/i)[0];
  return section
    .split(/<h3[^>]*>/i)
    .slice(1)
    .map((chunk) => {
      const [question, body = ''] = chunk.split(/<\/h3>/i);
      return { question: text(question), answer: text(body) };
    })
    .filter((item) => item.question && item.answer);
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
