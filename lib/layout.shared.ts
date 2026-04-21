import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    themeSwitch: {
      enabled: false,
    },
    nav: {
      title: 'paperlesspaper API',
    },
    links: [
      {
        type: 'main',
        text: 'Schema',
        url: 'https://api.paperlesspaper.de/openapi.json',
      },
      {
        type: 'main',
        text: 'paperlesspaper',
        url: 'https://paperlesspaper.de/en/posts/api',
      },
    ],
    githubUrl: 'https://github.com/paperlesspaper',
  };
}
