import { Status } from "@zeroko-io/commons/components/ledger"
import type { ServiceStatus as State } from "@zeroko-io/commons/lib/runner"

const states = {
  running: { tone: "ok", label: "Running" },
  stopped: { tone: "warn", label: "Stopped" },
  not_deployed: { tone: "idle", label: "Not deployed" },
} as const

export function ServiceStatus({ status }: { status: State }) {
  const s = states[status]
  return <Status tone={s.tone}>{s.label}</Status>
}
