import { SITE } from '@/consts';
import { type CollectionData, POST_TYPES, PostBuilder } from '@/service/mdx';

export async function GET() {
  const document = await PostBuilder.getAll();
  const posts = [...document];

  const result = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE.domain}</loc></url>
  ${createPostTypeSitemap()}
  ${createPostSitemap({ posts })}
</urlset>
  `.trim();

  return new Response(result, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}

const createPostSitemap = ({ posts }: { posts: CollectionData[] }) => {
  return posts
    .sort((a, b) => ((a.data.updated ?? a.data.date) > (b.data.updated ?? b.data.date) ? -1 : 1))
    .map((post) => {
      const lastMod = (post.data.updated ?? post.data.date).toISOString();
      return `<url><loc>${new URL(post.href, SITE.domain).href}/</loc><lastmod>${lastMod}</lastmod></url>`;
    })
    .join('\n');
};

const createPostTypeSitemap = () =>
  POST_TYPES.map(({ href }) => `<url><loc>${SITE.domain}${href}</loc></url>`).join('\n');
