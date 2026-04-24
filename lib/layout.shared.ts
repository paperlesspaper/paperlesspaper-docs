import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    themeSwitch: {
      enabled: false,
    },
    nav: {
      title: "paperlesspaper API",
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
