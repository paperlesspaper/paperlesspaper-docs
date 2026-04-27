import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import "./global.css";

export const metadata: Metadata = {
  title: {
    default: "paperlesspaper API Docs",
    template: "%s | paperlesspaper API Docs",
  },
  description:
    "Developer documentation for the paperlesspaper API, generated with FumaDocs from the live OpenAPI schema.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
