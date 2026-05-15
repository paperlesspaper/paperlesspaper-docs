import type { ReactNode } from "react";
import { source } from "@/lib/source";

type PageTree = typeof source.pageTree;
type PageTreeNode = PageTree["children"][number];

function nodeText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(nodeText).join("");
  }

  return "";
}

function walk(nodes: PageTreeNode[]): string[] {
  return nodes.flatMap((node) => {
    if (node.type === "page") {
      return [`- [${nodeText(node.name) || node.url}](${node.url})`];
    }

    if (node.type === "folder") {
      const folder = nodeText(node.name);
      const children = walk(node.children).map((line) => `  ${line}`);
      const index = node.index
        ? [`- [${nodeText(node.index.name) || node.index.url}](${node.index.url})`]
        : [];

      return [`- ${folder}`, ...index.map((line) => `  ${line}`), ...children];
    }

    return [];
  });
}

export function getLLMsIndex() {
  return [
    "# paperlesspaper API Docs",
    "",
    "Developer documentation for the paperlesspaper API and Open Integration.",
    "",
    "## Docs",
    "",
    ...walk(source.pageTree.children),
  ].join("\n");
}
