// The page's icon: Zeroko's mark on a square that follows the system's
// theme.
import { faviconSvg } from "@zeroko-io/commons/lib/brand"

export function GET() {
  return new Response(faviconSvg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=86400",
    },
  })
}
