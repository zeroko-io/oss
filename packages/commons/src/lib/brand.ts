// Zeroko's mark: a Z of two pieces that meet across a diagonal gap, on a
// 1000 × 1000 square (the Z spans 150 to 850 across, 200 to 800 down). The
// one source of the logo's mark and the apps' icons.

export const markPaths = [
  "M750 200V279.289C750 292.55 744.732 305.268 735.355 314.645L650 400L550 500V400V300H391.421C364.9 300 339.464 310.536 320.711 329.289L250 400H150V300V200H750Z",
  "M450 600V500L350 600L264.645 685.355C255.268 694.732 250 707.45 250 720.711V800H850V700V600H750L679.289 670.711C660.536 689.464 635.1 700 608.579 700H450V600Z",
]

const colors = {
  light: { ground: "#f5f3ee", mark: "#d0532a" },
  dark: { ground: "#0f0e0d", mark: "#e8673a" },
}

const paths = markPaths.map((d) => `<path d="${d}"/>`).join("")

/** The icon for browsers: the mark alone, on nothing, in the accent of the
 * system's theme. Square, with the Z centered. */
export const faviconSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="150 150 700 700">` +
  `<style>path{fill:${colors.light.mark}}` +
  `@media (prefers-color-scheme:dark){path{fill:${colors.dark.mark}}}</style>` +
  `${paths}</svg>`

/** The mark on a square in one theme, for places that need a ground: a
 * phone's home screen fills a transparent icon with black. */
export function tileSvg(theme: "light" | "dark"): string {
  const c = colors[theme]
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">` +
    `<rect width="1000" height="1000" fill="${c.ground}"/>` +
    `<g fill="${c.mark}">${paths}</g></svg>`
  )
}
