import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { PaperlesspaperLogo } from "@/components/paperlesspaper-logo";

export function baseOptions(): BaseLayoutProps {
  return {
    themeSwitch: {
      mode: "light-dark-system",
    },
    nav: {
      title: <PaperlesspaperLogo />,
    },
    links: [
      {
        type: "main",
        text: "paperlesspaper Website",
        url: "https://paperlesspaper.de/en",
      },
    ],
    githubUrl: "https://github.com/paperlesspaper",
  };
}
