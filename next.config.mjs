import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/panels/dke-13-3-inch/farbuebergaenge", destination: "/panels/dke-13-3-inch/colour-transitions", permanent: true },
      { source: "/panels/dke-13-3-inch/farbuebergaenge.md", destination: "/panels/dke-13-3-inch/colour-transitions.md", permanent: true },
      { source: "/panels/transition-atlas/messzeiten.csv", destination: "/panels/transition-atlas/transition-timings.csv", permanent: true },
      {
        source: "/development/testbench",
        destination: "/manufacturing/testbench",
        permanent: true,
      },
      {
        source: "/development/testbench.md",
        destination: "/manufacturing/testbench.md",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:path*.md",
        destination: "/llms.mdx/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
