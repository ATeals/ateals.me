import { defineCollection, z } from 'astro:content';

interface PostCollectionOptions {
  type: string;
}

const definePostCollection = (options: PostCollectionOptions) =>
  defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      type: z.string().default(options.type),
      description: z.string().optional().nullable(),
      image: z.string().optional().nullable(),
      updated: z.coerce.date().optional().nullable(),
      icon: z.string().optional().nullable(),
      series: z.string().optional().nullable(),
      tags: z.array(z.string()).default([]).optional()
    })
  });

const dev = definePostCollection({ type: 'dev' });
const docs = definePostCollection({ type: 'docs' });
const snippet = definePostCollection({ type: 'snippet' });

export const collections = { dev, docs, snippet };
