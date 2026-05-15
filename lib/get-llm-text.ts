import { readFile } from "node:fs/promises";
import type { InferPageType } from "fumadocs-core/source";
import { source } from "@/lib/source";

type SourcePage = InferPageType<typeof source>;

type StructuredEntry = {
  id?: string;
  content?: string;
};

function structuredDataToMarkdown(structuredData: unknown) {
  if (!structuredData || typeof structuredData !== "object") {
    return "";
  }

  const data = structuredData as {
    headings?: StructuredEntry[];
    contents?: (StructuredEntry & { heading?: string })[];
  };
  const lines: string[] = [];

  for (const heading of data.headings ?? []) {
    if (!heading.content) {
      continue;
    }

    lines.push(`## ${heading.content}`);

    for (const content of data.contents ?? []) {
      if (content.heading === heading.id && content.content) {
        lines.push(content.content);
      }
    }
  }

  for (const content of data.contents ?? []) {
    if (!content.heading && content.content) {
      lines.push(content.content);
    }
  }

  return lines.join("\n\n");
}

export async function getLLMText(page: SourcePage) {
  const title = page.data.title ?? page.url;
  const description = page.data.description
    ? `\n\n${page.data.description}`
    : "";

  if (page.absolutePath && /\.mdx?$/i.test(page.absolutePath)) {
    const content = await readFile(page.absolutePath, "utf8");

    return `# ${title} (${page.url})${description}\n\n${content}`;
  }

  const content = structuredDataToMarkdown(
    (page.data as { structuredData?: unknown }).structuredData,
  );

  return `# ${title} (${page.url})${description}${
    content ? `\n\n${content}` : ""
  }`;
}
