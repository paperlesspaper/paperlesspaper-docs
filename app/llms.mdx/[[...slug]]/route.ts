import { notFound } from "next/navigation";
import { getLLMText } from "@/lib/get-llm-text";
import { source } from "@/lib/source";

type RouteContext = {
  params: Promise<{
    slug?: string[];
  }>;
};

function normalizeSlug(slug: string[] | undefined) {
  if (slug?.length === 1 && slug[0] === "index") {
    return undefined;
  }

  return slug;
}

export const revalidate = false;

export async function GET(_: Request, { params }: RouteContext) {
  const { slug } = await params;
  const page = source.getPage(normalizeSlug(slug));

  if (!page) {
    notFound();
  }

  return new Response(await getLLMText(page), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
    },
  });
}

export function generateStaticParams() {
  return [
    { slug: ["index"] },
    ...source
      .generateParams()
      .filter((params) => params.slug.length > 0),
  ];
}
