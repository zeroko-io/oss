// Browsers ask for /favicon.ico whatever the page declares: answer with
// the same icon as app/icon.svg.
import { readFile } from "node:fs/promises"
import path from "node:path"

export async function GET() {
  const svg = await readFile(path.join(process.cwd(), "app/icon.svg"))
  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=86400",
    },
  })
}
