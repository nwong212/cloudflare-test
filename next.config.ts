import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

initOpenNextCloudflareForDev()

const nextConfig: NextConfig = {
  // Your Next.js config here
  webpack: (config, options) => {
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return config
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
