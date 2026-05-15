import { getLLMsIndex } from "@/lib/llms";

export const revalidate = false;

export function GET() {
  return new Response(getLLMsIndex(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
