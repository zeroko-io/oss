// The runner, as the admin: with the root token. Server code only.
import { headers } from "next/headers"
import { Runner } from "@zeroko-io/commons/lib/runner"

import { config } from "./config"

export function runner(): Runner {
  const { runnerUrl, token } = config()
  return new Runner(runnerUrl, token)
}

/** The panel's public address, where agents reach the API and the skill. */
export async function publicUrl(): Promise<string> {
  const fixed = config().publicUrl
  if (fixed) return fixed
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  const proto = h.get("x-forwarded-proto") ?? "http"
  return `${proto}://${host}`
}
