import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  input: [process.env.OPENAPI_JSON_URL ?? 'https://api.paperlesspaper.de/openapi.json'],
});
