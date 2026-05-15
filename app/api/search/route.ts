import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

function getStructuredData(page: { data: unknown }) {
  const structuredData = (page.data as { structuredData?: unknown }).structuredData;

  if (
    structuredData &&
    typeof structuredData === 'object' &&
    'headings' in structuredData &&
    'contents' in structuredData
  ) {
    return structuredData as never;
  }

  return {
    headings: [],
    contents: [],
  };
}

export const { GET } = createFromSource(source, {
  language: 'english',
  buildIndex(page) {
    return {
      id: page.url,
      url: page.url,
      title: page.data.title ?? page.url,
      description: page.data.description,
      structuredData: getStructuredData(page),
    };
  },
});
