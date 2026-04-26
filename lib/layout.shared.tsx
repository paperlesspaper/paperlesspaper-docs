import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Globe } from "lucide-react";
import { PaperlesspaperLogo } from "@/components/paperlesspaper-logo";

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.9 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 6.8A5.2 5.2 0 1 1 6.8 12 5.2 5.2 0 0 1 12 6.8Zm0 1.8A3.4 3.4 0 1 0 15.4 12 3.4 3.4 0 0 0 12 8.6Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.45 2c.22 1.86 1.27 3.55 2.88 4.49A6.7 6.7 0 0 0 21 7.38v2.97a9.4 9.4 0 0 1-3.93-1.13v6.03A6.25 6.25 0 1 1 10.82 9v3.09a3.4 3.4 0 1 0 2.94 3.36V2h.69Z" />
    </svg>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    themeSwitch: {
      mode: "light-dark-system",
    },
    nav: {
      title: <PaperlesspaperLogo />,
    },
    links: [
      /*  {
        type: "main",
        text: "paperlesspaper Website",
        url: "https://paperlesspaper.de/en",
        icon: <Globe className="text-violet-600 dark:text-violet-400" />,
      }, */
      {
        type: "icon",
        label: "Instagram",
        text: "Instagram",
        url: "https://www.instagram.com/paperless.paper",
        icon: <InstagramIcon />,
        external: true,
      },
      {
        type: "icon",
        label: "TikTok",
        text: "TikTok",
        url: "https://www.tiktok.com/@paperlesspaperlesspaper",
        icon: <TikTokIcon />,
        external: true,
      },
    ],
    githubUrl: "https://github.com/paperlesspaper",
  };
}
