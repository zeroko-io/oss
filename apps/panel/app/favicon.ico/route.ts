// Browsers ask for /favicon.ico whatever the page declares: answer with
// the same mark as app/icon.svg.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0f0e0d"/><rect x="10" y="10" width="12" height="12" fill="#e8673a"/></svg>`

export function GET() {
  return new Response(icon, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": "public, max-age=86400",
    },
  })
}
