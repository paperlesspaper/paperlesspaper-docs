import { loader, multiple } from 'fumadocs-core/source';
import { resolveFiles } from 'fumadocs-mdx';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { docs, meta } from '../.source';
import { openapi } from '@/lib/openapi';

export const source = loader(
  multiple({
    docs: {
      files: resolveFiles({ docs, meta }),
    },
    openapi: await openapiSource(openapi, {
      baseDir: 'api-reference',
    }),
  }),
  {
    baseUrl: '/',
    plugins: [openapiPlugin() as never],
  },
);
