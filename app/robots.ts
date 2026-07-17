import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing useful to a crawler, and /dashboard is behind auth anyway.
      disallow: ["/api/", "/dashboard", "/auth/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
