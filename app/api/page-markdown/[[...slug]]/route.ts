import { readFile } from 'node:fs/promises';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';

type RouteContext = {
  params: Promise<{
    slug?: string[];
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  if (!page.absolutePath || !/\.mdx?$/i.test(page.absolutePath)) {
    return new Response('Markdown source is not available for this page.', {
      status: 404,
    });
  }

  const content = await readFile(page.absolutePath, 'utf8');

  return new Response(content, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
    },
  });
}