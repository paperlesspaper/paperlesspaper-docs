import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

export function OpenPaperPromo() {
  return (
    <aside
      aria-label="Support open source with OpenPaper"
      className="not-prose mt-6 shrink-0 overflow-hidden rounded-xl border border-fd-border bg-fd-card text-fd-card-foreground"
    >
      <Image
        src="/products/openpaper-l.jpg"
        alt="OpenPaper L in a wooden frame displaying a colorful portrait"
        width={800}
        height={533}
        sizes="(min-width: 1280px) 280px, (min-width: 768px) 640px, 100vw"
        className="aspect-[3/2] w-full object-cover"
      />
      <div className="space-y-3 p-4">
        <p className="text-sm font-semibold leading-snug">
          Get a frame. Support open source.
        </p>
        <p className="text-sm leading-relaxed text-fd-muted-foreground">
          Meet OpenPaper, our open-source e-paper frame. Your purchase helps keep
          building and sharing.
        </p>
        <a
          href="https://paperlesspaper.de/en/openpaper-l"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-sm text-sm font-semibold text-fd-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fd-ring"
        >
          Explore OpenPaper
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </a>
      </div>
    </aside>
  );
}
