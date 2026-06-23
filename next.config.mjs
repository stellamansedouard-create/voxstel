/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  webpack: (config, { nextRuntime }) => {
    if (nextRuntime === 'edge') {
      // @opentelemetry/api is dynamically required by @supabase/supabase-js.
      // Next.js aliases it to next/dist/compiled/@opentelemetry/api which uses
      // __dirname — unavailable in Vercel Edge Runtime. Replace with an empty
      // module; supabase-js already handles the missing package with .catch(() => null).
      config.resolve.alias['@opentelemetry/api'] = false;
    }
    return config;
  },
};

export default nextConfig;
