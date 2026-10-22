import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { CopyButton } from "@zeroko-io/commons/components/copy-button"
import {
  Fact,
  Facts,
  LogLines,
  type LogTone,
  Meter,
  Mono,
  SectionTitle,
  Stat,
  Stats,
} from "@zeroko-io/commons/components/ledger"
import {
  bytesParts,
  clock,
  day,
  duration,
  formatBytes,
  relative,
} from "@zeroko-io/commons/lib/format"
import type { LogEntry } from "@zeroko-io/commons/lib/runner"

import { TopLink } from "@zeroko-io/commons/components/navigation"
import { Page } from "@zeroko-io/commons/components/page"
import { RunCron } from "@zeroko-io/commons/views/service/overview"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export async function generateMetadata(
  props: PageProps<"/services/[name]">
): Promise<Metadata> {
  return { title: decodeURIComponent((await props.params).name) }
}

const sourceTone: Record<LogEntry["source"], LogTone> = {
  request: "info",
  console: "idle",
  fetch: "idle",
  runtime: "brand",
}

function egressSummary(hosts: string[]): string {
  if (hosts.includes("*")) return "any public host"
  return hosts.length ? hosts.join(", ") : "none"
}

export default async function ServiceOverview(
  props: PageProps<"/services/[name]">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  const r = runner()
  const [service, logs] = await Promise.all([
    r.service(name),
    r.logs(name, { limit: 12 }),
  ])
  const d = service.deployment
  const m = service.manifest
  const p = service.process
  const [stored, storedUnit] = bytesParts(service.bytes)
  // The service's own vars over the version's.
  const vars = Object.entries({
    ...m?.vars,
    ...Object.fromEntries(service.vars.map((v) => [v.name, v.value])),
  }).sort(([a], [b]) => a.localeCompare(b))
  const lines = logs.reverse().map((l) => ({
    id: l.id,
    time: clock(l.ts),
    kind: l.level === "error" ? "error" : l.source,
    tone: l.level === "error" ? ("error" as const) : sourceTone[l.source],
    message: l.message,
  }))
  const base = `/services/${encodeURIComponent(service.name)}`

  return (
    <Page>
      <Stats className="md:grid-cols-5">
        <Stat
          label="Live version"
          value={d ? `v${d.number}` : "none"}
          unit={d ? relative(d.created_at) : undefined}
        />
        <Stat
          label="Process"
          value={
            p ? formatBytes(p.memory) : service.stopped ? "stopped" : "idle"
          }
          unit={p ? `${p.cpu}% cpu` : undefined}
        />
        <Stat label="Storage" value={stored} unit={storedUnit} />
        <Stat
          label="Jobs"
          value={service.jobs.queued + service.jobs.running}
          unit={service.jobs.dead ? `${service.jobs.dead} dead` : undefined}
        />
        <Stat label="Connections" value={service.connections} unit="live" />
      </Stats>

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-10">
          <section className="flex flex-col gap-3">
            <SectionTitle>Bindings</SectionTitle>
            {service.bindings.length === 0 ? (
              <p className="text-muted-foreground">
                {d
                  ? "This version declares no bindings."
                  : "Nothing deployed yet."}
              </p>
            ) : (
              <ul className="flex flex-col border-t">
                {service.bindings.map((b) => (
                  <li
                    key={b.name}
                    className="flex items-baseline gap-5 border-b border-rule py-2.5"
                  >
                    <Mono className="w-20 shrink-0 text-brand">
                      {b.type.startsWith("service:") ? "service" : b.type}
                    </Mono>
                    <span className="font-mono text-[13px]">{b.name}</span>
                    <Mono className="ml-auto">
                      {b.type.startsWith("service:")
                        ? `calls ${b.type.slice(8)}`
                        : b.type === "files"
                          ? `${b.count ?? 0} files - ${formatBytes(b.bytes ?? 0)}`
                          : b.type === "db"
                            ? formatBytes(b.bytes ?? 0)
                            : ""}
                    </Mono>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <SectionTitle>Recent logs</SectionTitle>
              <TopLink
                href={`${base}/logs`}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                Tail the log <ArrowRight aria-hidden className="size-3" />
              </TopLink>
            </div>
            <LogLines lines={lines} />
          </section>
        </div>

        <Facts>
          <Meter
            label="Disk"
            used={formatBytes(service.bytes)}
            total={formatBytes(service.disk_quota)}
            ratio={service.disk_quota ? service.bytes / service.disk_quota : 0}
          />
          <Fact label="Crons">
            {m?.crons?.length ? (
              <span className="flex flex-col gap-1">
                {m.crons.map((c) => (
                  <span key={c.schedule} className="flex items-center gap-3">
                    {c.schedule}
                    {!service.stopped && (
                      <RunCron service={service.name} schedule={c.schedule} />
                    )}
                  </span>
                ))}
              </span>
            ) : (
              "none"
            )}
          </Fact>
          {vars.length > 0 && (
            <Fact label="Vars">
              <span className="flex flex-col gap-0.5">
                {vars.map(([k, v]) => (
                  <span key={k} className="truncate" title={v}>
                    {k} <span className="text-muted-foreground">= {v}</span>
                  </span>
                ))}
              </span>
            </Fact>
          )}
          <Fact label="Egress">{egressSummary(service.egress)}</Fact>
          {p && <Fact label="Up for">{duration(Date.now() - p.started)}</Fact>}
          <Fact label="Created">{day(service.created_at)}</Fact>
          <Fact label="ID">
            <span className="flex items-center gap-1">
              {service.id}
              <CopyButton
                text={service.id}
                variant="ghost"
                size="sm"
                className="h-5 px-1.5 font-mono text-[11px] font-normal"
              >
                copy
              </CopyButton>
            </span>
          </Fact>
        </Facts>
      </div>
    </Page>
  )
}
