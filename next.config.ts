import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
  output: 'export',
  // Images configuration. All imagery is served locally from /public, so no
  // remote patterns are needed. `unoptimized` is required for static export.
  images: {
    unoptimized: true,
  },
  // Optional: base path and asset prefix if using a subdirectory deployment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
}

// Wrap with @next/bundle-analyzer when ANALYZE=true. The wrapper is a no-op
// otherwise, so default builds and production output are unchanged. Run with
// `npm run analyze` to generate the HTML report under .next/analyze/.
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default bundleAnalyzer(nextConfig)
