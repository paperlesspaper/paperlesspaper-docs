import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ComponentProps, ComponentType } from 'react';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { APIPage } from 'fumadocs-openapi/ui';
import { getMDXComponents } from '@/components/mdx';
import { source } from '@/lib/source';

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function DocsCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const getAPIPageProps = (page.data as {
    getAPIPageProps?: () => ComponentProps<typeof APIPage>;
  }).getAPIPageProps;

  if (typeof getAPIPageProps === 'function') {
    return (
      <DocsPage full>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <APIPage {...getAPIPageProps()} />
        </DocsBody>
      </DocsPage>
    );
  }

  const mdxPage = page as typeof page & {
    data: {
      body: ComponentType<{ components?: ReturnType<typeof getMDXComponents> }>;
      toc?: ComponentProps<typeof DocsPage>['toc'];
      full?: boolean;
      title?: string;
      description?: string;
    };
  };
  const MDX = mdxPage.data.body;

  return (
    <DocsPage toc={mdxPage.data.toc} full={mdxPage.data.full}>
      <DocsTitle>{mdxPage.data.title}</DocsTitle>
      <DocsDescription>{mdxPage.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
