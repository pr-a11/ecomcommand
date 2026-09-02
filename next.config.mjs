import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageHosts } from './image-hosts.config.mjs';

// Directory that contains this config file. Resolved from import.meta.url so it
// is correct on any platform/checkout path (WSL, macOS, Vercel's Linux builder).
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: ships readable client source maps to the public CDN. Kept ON
  // deliberately for production debuggability — turn off if the client bundle
  // must not be trivially de-minified by third parties.
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',

  // Pin file tracing to this project. Without it Next walks up and picks the
  // nearest ancestor lockfile as the workspace root, which mis-scopes
  // serverless function file tracing (and emits the "inferred your workspace
  // root" warning) on every build.
  outputFileTracingRoot: projectRoot,

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    // Formatting pass has landed and all lint errors are fixed, so the Vercel
    // build now fails on real lint regressions. Only `no-explicit-any`
    // warnings remain, and warnings do not fail the build.
    ignoreDuringBuilds: false,
  },

  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
    qualities: [75, 85, 100],
  }
};
export default nextConfig;
