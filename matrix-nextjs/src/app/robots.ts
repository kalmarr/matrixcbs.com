import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/data/',
        '/_next/image/',
        '/admin/',
        '/maintenance/',
        '/nevjegy/',
      ],
    },
    sitemap: 'https://matrixcbs.com/sitemap.xml',
  };
}
