import type { APIRoute } from 'astro';

import { SITE } from '@/consts';

const getRobotsTxt = () => `
User-agent: *
Allow: /

Sitemap: ${new URL(`/sitemap.xml`, SITE.domain).href}
`;

export const GET: APIRoute = () => {
  return new Response(getRobotsTxt());
};
