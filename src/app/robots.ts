import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ["/v1/", "/error"],
    },
    sitemap: 'https://palatracker.bromine.fr/sitemap.xml',
  }
}