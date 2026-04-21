import { createSearchAPI } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

export const { GET } = createSearchAPI('advanced', {
  language: 'english',
  indexes: source
    .getPages()
    .filter((page) => 'structuredData' in page.data && page.data.structuredData != null)
    .map((page) => ({
      id: page.url,
      url: page.url,
      title: page.data.title ?? page.url,
      description: page.data.description,
      structuredData: ((page.data as unknown as { structuredData: unknown }).structuredData ??
        []) as never,
    })) as never,
});
