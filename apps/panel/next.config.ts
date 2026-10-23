import { createRequire } from "node:module"
import path from "node:path"
import type { NextConfig } from "next"

import pkg from "./package.json" with { type: "json" }

const nextConfig: NextConfig = {
  transpilePackages: ["@zeroko-io/commons"],
  // A server that runs on its own, for the image: traced from the
  // workspace's root, since @zeroko-io/commons lives outside this app. That
  // is where next is installed: this repository, or the one that includes it
  // as a submodule.
  output: "standalone",
  outputFileTracingRoot: path.resolve(
    path.dirname(createRequire(import.meta.url).resolve("next/package.json")),
    "../.."
  ),
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
