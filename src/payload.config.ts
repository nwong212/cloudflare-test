// storage-adapter-import-placeholder
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const cloudflare = process.argv.find((value) => value.match(/^(generate|migrate):?/))
  ? await getCloudflareContextFromWrangler()
  : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  plugins: [
    payloadCloudPlugin(),
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
async function getCloudflareContextFromWrangler<
  CfProperties extends Record<string, unknown> = IncomingRequestCfProperties,
  Context = ExecutionContext,
>(options?: GetPlatformProxyOptions): Promise<CloudflareContext<CfProperties, Context>> {
  // Note: we never want wrangler to be bundled in the Next.js app, that's why the import below looks like it does
  const { getPlatformProxy } = await import(
    /* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`
  )

  // This allows the selection of a wrangler environment while running in next dev mode
  const environment = options?.environment ?? process.env.CLOUDFLARE_ENV

  const { env, cf, ctx } = await getPlatformProxy({
    ...options,
    environment,
    experimental: { remoteBindings: process.env.NODE_ENV === 'production' },
  })

  return {
    env,
    cf: cf as unknown as CfProperties,
    ctx: ctx as Context,
  }
}
