import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentProps, ComponentType } from "react";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import {
  API as OpenAPI,
  APIInfo as OpenAPIInfo,
  APIPage,
} from "fumadocs-openapi/ui";
import {
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "@/components/ai/page-actions";
import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";

const DOCS_GITHUB_BRANCH = "main";

function getMarkdownUrl(slugs: string[]) {
  return slugs.length > 0
    ? `/${slugs.map(encodeURIComponent).join("/")}.md`
    : "/index.md";
}

function getGithubUrl(page: { path: string; absolutePath?: string }) {
  if (!page.absolutePath?.includes("/content/docs/")) {
    return undefined;
  }

  return `https://github.com/paperlesspaper/paperlesspaper-docs/blob/${DOCS_GITHUB_BRANCH}/content/docs/${page.path}`;
}

function renderPageActions(page: {
  slugs: string[];
  path: string;
  absolutePath?: string;
}) {
  const markdownUrl =
    page.absolutePath && /\.mdx?$/i.test(page.absolutePath)
      ? getMarkdownUrl(page.slugs)
      : undefined;
  const githubUrl = getGithubUrl(page);

  if (!markdownUrl && !githubUrl) {
    return <ViewOptionsPopover />;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {markdownUrl ? <MarkdownCopyButton markdownUrl={markdownUrl} /> : null}
      <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
    </div>
  );
}

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

  const getAPIPageProps = (
    page.data as {
      getAPIPageProps?: () => ComponentProps<typeof APIPage>;
    }
  ).getAPIPageProps;

  if (typeof getAPIPageProps === "function") {
    return (
      <DocsPage full>
        <DocsBody>
          <APIPage
            {...getAPIPageProps()}
            hasHead
            renderer={{
              API: ({ children, ...props }) => (
                <OpenAPI
                  {...props}
                  className="grid gap-x-6 gap-y-4 xl:grid-cols-[minmax(0,1fr)_400px]"
                >
                  {children}
                </OpenAPI>
              ),
              APIInfo: ({ children, head }) => (
                <>
                  <div className="min-w-0 xl:col-span-2">
                    {head}
                    {renderPageActions(page)}
                  </div>
                  <OpenAPIInfo>{children}</OpenAPIInfo>
                </>
              ),
            }}
          />
        </DocsBody>
      </DocsPage>
    );
  }

  const mdxPage = page as typeof page & {
    data: {
      body: ComponentType<{ components?: ReturnType<typeof getMDXComponents> }>;
      toc?: ComponentProps<typeof DocsPage>["toc"];
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
      {renderPageActions(mdxPage)}
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
