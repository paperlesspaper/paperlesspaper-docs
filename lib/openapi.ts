import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  input: ['https://api.paperlesspaper.de/openapi.json'],
});
