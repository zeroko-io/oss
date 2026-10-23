// The runner, as the admin: with the root token. Server code only.
import { headers } from "next/headers"
import { cache } from "react"
import * as commonsLoad from "@zeroko-io/commons/lib/load"
import { Runner } from "@zeroko-io/commons/lib/runner"

import { config } from "./config"

/** The runner, one per request, so that commons' loaders share it. */
export const runner = cache((): Runner => {
  const { runnerUrl, token } = config()
  return new Runner(runnerUrl, token)
})

// What several parts of one page ask for, asked once per request.
export const loadSettings = () => commonsLoad.loadSettings(runner())
export const loadSystem = () => commonsLoad.loadSystem(runner())
export const loadService = (name: string) =>
  commonsLoad.loadService(runner(), name)

/** The panel's public address, where agents reach the API and the skill. */
export async function publicUrl(): Promise<string> {
  const fixed = config().publicUrl
  if (fixed) return fixed
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? "http"
  return `${proto}://${host}`
}
