import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Articles (SEO / GEO) du site IA. */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().max(220),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    readingMinutes: z.number().int().positive(),
    cover: z.object({ src: z.string(), alt: z.string() }).optional(),
    /** Type d'article (code couleur des cartes, tokens --kind-*). */
    kind: z.enum(['guide', 'explainer', 'trend']).default('guide'),
    /** Mot-clé principal et service lié (slug de src/data/ai.ts) pour le maillage interne. */
    keyword: z.string(),
    service: z.string(),
    published: z.boolean().default(true),
    seo: z.object({ title: z.string().max(70).optional(), description: z.string().max(160).optional() }).optional(),
  }),
});

export const collections = { posts };
