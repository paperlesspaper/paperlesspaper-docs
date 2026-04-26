import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { ExternalLinkIcon } from "lucide-react";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={source.pageTree}
      sidebar={{
        footer: (
          <a
            href="https://paperlesspaper.de/en"
            target="_blank"
            rel="noreferrer noopener"
            className="order-first mb-2 mt-2 inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground"
          >
            paperlesspaper Website
            <ExternalLinkIcon className="size-3.5" />
          </a>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
