import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';

import { SITE } from '@/consts';
import { PostBuilder } from '@/service/mdx';

export const GET: APIRoute = async () => {
  const document = await PostBuilder.getAll();

  const posts = [...document];

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.domain,
    items: posts.map((post) => ({
      ...post.data,
      link: `/posts/${post.slug}/`,
      pubDate: post.data.date
    }))
  });
};
