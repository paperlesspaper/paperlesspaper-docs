# paperlesspaper-docs

Work in progress: This new documentation is new and subject to change. PRs are welcome!

Live on [docs.paperlesspaper.de](https://docs.paperlesspaper.de)

Developer documentation for the paperlesspaper API.

This repository contains a Next.js 16 documentation site built with FumaDocs. It combines handwritten MDX guides from `content/docs` with API reference pages generated from the live OpenAPI schema at `https://api.paperlesspaper.de/openapi.json`.

## Stack

- Next.js 16
- React 19
- FumaDocs
- FumaDocs OpenAPI
- Tailwind CSS 4

## Local development

Install dependencies:

```bash
yarn install
```

Start the development server:

```bash
yarn dev
```

Open `http://localhost:3000`.

## Available scripts

- `yarn dev` starts the local development server.
- `yarn build` creates a production build.
- `yarn start` serves the production build.
- `yarn lint` runs the project linter.

## Production deployment

Dokploy builds this repository with Railpack. `railpack.json` invokes Yarn through
Corepack explicitly, retaining the Yarn version and SHA-512 checksum in
`package.json` and the frozen dependency lockfile. This avoids the Mise Yarn shim,
which otherwise attempts a second package-manager installation and can fail its
provenance check before the docs build starts. The runtime starts Next.js directly
so it does not need to install or download a package manager.

## Content model

- `content/docs` contains the authored MDX pages and sidebar metadata.
- `lib/openapi.ts` points FumaDocs at the live paperlesspaper OpenAPI schema.
- `app` contains the Next.js app router entrypoints and FumaDocs page wiring.
- `components` contains custom MDX and UI helpers for the docs experience.

## Generated API reference

The API reference is generated from the live schema configured in `lib/openapi.ts`. That means local and deployed docs reflect the current published OpenAPI document rather than a checked-in schema snapshot.

If the schema changes, the generated endpoint reference updates with it the next time the site is built.
