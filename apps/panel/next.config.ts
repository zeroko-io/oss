import path from "node:path"
import type { NextConfig } from "next"

import pkg from "./package.json" with { type: "json" }

const nextConfig: NextConfig = {
  transpilePackages: ["@zeroko-io/commons"],
  // A server that runs on its own, for the image: traced from the
  // repository's root, since @zeroko-io/commons lives outside this app.
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  outputFileTracingIncludes: {
    "/skill.md": ["./skill.md"],
  },
  env: {
    // The panel's version, shown in System and checked against releases:
    // the image's (git describe), else package.json's.
    ZEROKO_PANEL_VERSION: process.env.VERSION || pkg.version,
  },
}

export default nextConfig
