import { CodeXml, Image as FrameIcon } from "lucide-react";

const actions = [
  { label: "Buy an OpenPaper frame", href: "https://paperlesspaper.de/en/buy-7-inch-epaper-picture-frame", icon: FrameIcon },
  { label: "Contribute on GitHub", href: "https://github.com/paperlesspaper", icon: CodeXml },
];

export function ProjectSupport() {
  return (
    <aside id="support-the-project" aria-labelledby="project-support-title" className="not-prose my-8 scroll-mt-24 rounded-xl bg-[#104aa1] px-4 py-5 text-center text-white sm:px-6">
      <h2 id="project-support-title" className="m-0 text-xl font-bold leading-tight">
        Support the project
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed">
        Help develop open-source e-paper hardware by buying a frame or contributing on GitHub.
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {actions.map(({ label, href, icon: Icon }) => (
          <a key={href} href={href} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-white/20 px-3 text-sm font-semibold text-white hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2">
            <Icon size={16} aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 text-sm underline-offset-4 [&_a]:inline-flex [&_a]:min-h-7 [&_a]:items-center [&_a]:text-white [&_a]:underline">
        <a href="https://www.instagram.com/paperless.paper/">Instagram</a>
        <a href="https://social.tchncs.de/@paperlesspaper">Mastodon</a>
        <a href="https://paperlesspaper.de/en/posts/contact">Contact us</a>
      </div>
    </aside>
  );
}
