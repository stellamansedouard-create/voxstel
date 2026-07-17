import type { MetadataRoute } from "next";
import { LIBRARY_PAGES } from "@/lib/library";
import { absoluteUrl } from "@/lib/site";

/**
 * Public, indexable URLs only. Anything behind auth (/dashboard, /login,
 * /signup) or under /api stays out — see app/robots.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, priority: 1 },
    { url: absoluteUrl("/generateur-de-prompt"), lastModified, priority: 0.9 },
    { url: absoluteUrl("/bibliotheque"), lastModified, priority: 0.9 },
    { url: absoluteUrl("/generate"), lastModified, priority: 0.7 },
    { url: absoluteUrl("/pricing"), lastModified, priority: 0.5 },
    { url: absoluteUrl("/cgu-cgv"), lastModified, priority: 0.1 },
    { url: absoluteUrl("/mentions-legales"), lastModified, priority: 0.1 },
    {
      url: absoluteUrl("/politique-de-confidentialite"),
      lastModified,
      priority: 0.1,
    },
  ];

  const promptPages: MetadataRoute.Sitemap = LIBRARY_PAGES.map((page) => ({
    url: absoluteUrl(`/prompts/${page.slug}`),
    lastModified,
    priority: 0.8,
  }));

  return [...staticPages, ...promptPages];
}
