import type { NextConfig } from "next"

import pkg from "./package.json" with { type: "json" }

const nextConfig: NextConfig = {
  transpilePackages: ["@zeroko/ui"],
  env: {
    // The panel's version, shown in System and checked against releases.
    ZEROKO_PANEL_VERSION: pkg.version,
  },
}

export default nextConfig
