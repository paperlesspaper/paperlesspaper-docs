import { loader, multiple } from "fumadocs-core/source";
import { resolveFiles } from "fumadocs-mdx";
import { openapiPlugin, openapiSource } from "fumadocs-openapi/server";
import { BookOpen, House, PlugZap, Rocket } from "lucide-react";
import { createElement } from "react";
import { docs, meta } from "../.source";
import { openapi } from "@/lib/openapi";

function createMenuIcon(Icon: typeof House, className: string) {
  return createElement(Icon, {
    "aria-hidden": true,
    className,
  });
}

const topLevelFolderIcons = {
  "api-reference": createMenuIcon(BookOpen, "text-sky-600 dark:text-sky-400"),
  "api-guide": createMenuIcon(Rocket, "text-amber-600 dark:text-amber-400"),
  "open-integration": createMenuIcon(
    PlugZap,
    "text-rose-600 dark:text-rose-400",
  ),
} as const;

const topLevelFolderNames = {
  "api-reference": "API Reference",
  "api-guide": "API Guide",
} as const;

export const source = loader(
  multiple({
    docs: {
      files: resolveFiles({ docs, meta }),
    },
    openapi: await openapiSource(openapi, {
      baseDir: "api-reference",
    }),
  }),
  {
    baseUrl: "/",
    plugins: [openapiPlugin() as never],
    pageTree: {
      attachFile(node) {
        if (node.url === "/") {
          return {
            ...node,
            icon: createMenuIcon(
              House,
              "text-emerald-600 dark:text-emerald-400",
            ),
          };
        }

        return node;
      },
      attachFolder(node) {
        const icon =
          topLevelFolderIcons[node.$id as keyof typeof topLevelFolderIcons];
        const name =
          topLevelFolderNames[node.$id as keyof typeof topLevelFolderNames];

        if (!icon && !name) {
          return node;
        }

        return {
          ...node,
          ...(name ? { name } : null),
          icon,
        };
      },
    },
  },
);
