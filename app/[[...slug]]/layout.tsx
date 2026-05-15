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
          <div className="order-first mb-2 mt-2 space-y-2">
            <div className="rounded-md bg-blue-600 p-3 text-sm leading-5 text-white">
              <p className="font-semibold">Beta Notice 🎉</p>
              <p>API and Open Integration are in beta and subject to change.</p>
              <a
                href="https://github.com/paperlesspaper/paperlesspaper-docs/issues"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-flex items-center gap-1.5 font-medium underline underline-offset-2"
              >
                Give feedback
                <ExternalLinkIcon className="size-3.5" />
              </a>
            </div>
            <a
              href="https://paperlesspaper.de/en"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground"
            >
              paperlesspaper Website
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
