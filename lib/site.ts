/**
 * The canonical origin, for canonical URLs, Open Graph and the sitemap.
 *
 * voxstel.com redirects to www.voxstel.com, so www is the canonical host —
 * pointing canonicals at the bare domain would aim them at a redirect.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.voxstel.com";

/** Absolute URL for a root-relative path, e.g. "/bibliotheque". */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
