"use client"

import { LogView } from "@zeroko/ui/components/log-view"

import { runner } from "@/lib/browser"

const sources = [
  ["request", "Requests"],
  ["console", "Console"],
  ["fetch", "Outbound"],
  ["runtime", "Runtime"],
] as const

/** Tails a service's log: the newest lines, then waits for more. */
export function ServiceLogs({ name }: { name: string }) {
  return (
    <LogView
      sources={sources}
      empty="Nothing logged yet."
      load={async (after) => {
        const logs = await runner.logs(
          name,
          after ? { after, limit: 500, wait: 15 } : { limit: 500 }
        )
        return logs.map((l) => ({
          id: l.id,
          ts: l.ts,
          level: l.level,
          source: l.source,
          text: l.message,
        }))
      }}
    />
  )
}
