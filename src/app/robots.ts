import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_PALACLICKER_API_URL === "https://palatracker.bromine.fr";

  return {
    rules: {
      userAgent: '*',
      allow: isProduction ? '/' : '',
      disallow: isProduction ? ["/v1/", "/error"] : ['/'],
    },
    sitemap: isProduction ? 'https://palatracker.bromine.fr/sitemap.xml' : '',
  };
}