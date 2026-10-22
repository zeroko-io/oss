import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@zeroko/ui/components/button"
import {
  Fact,
  Facts,
  Kicker,
  LogLines,
  type LogTone,
  Mono,
  PageHeader,
  SectionTitle,
  Table,
  Td,
  Th,
} from "@zeroko/ui/components/ledger"
import { clock, day, formatBytes, timeAgo } from "@zeroko/ui/lib/format"
import { type LogEntry, RunnerError } from "@zeroko/ui/lib/runner"

import { DeleteService } from "@/components/delete-service"
import { ServiceStatus } from "@/components/service-status"
import { activate, setStopped } from "@/lib/actions"
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

function bindingDetail(b: {
  type: string
  bytes?: number
  count?: number
}): string {
  switch (b.type) {
    case "db":
      return `SQLite · ${formatBytes(b.bytes ?? 0)}`
    case "files":
      return `${b.count ?? 0} files · ${formatBytes(b.bytes ?? 0)}`
    default:
      return ""
  }
}

export default async function ServicePage(
  props: PageProps<"/services/[name]">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  const r = runner()
  const [service, deployments, logs, settings] = await Promise.all([
    r.service(name),
    r.deployments(name),
    r.logs(name, { limit: 40 }),
    r.settings(),
  ]).catch((err) => {
    if (err instanceof RunnerError && err.status === 404) notFound()
    throw err
  })

  const stopped = service.status === "stopped"
  const lines = logs
    .slice(-40)
    .reverse()
    .map((l) => ({
      id: l.id,
      time: clock(l.ts),
      kind: l.level === "error" ? "error" : l.source,
      tone: l.level === "error" ? ("error" as const) : sourceTone[l.source],
      message: l.message,
    }))

  return (
    <>
      <Kicker>
        <Link href="/" className="hover:text-foreground">
          Services
        </Link>{" "}
        / <span className="text-foreground">{service.name}</span>
      </Kicker>
      <PageHeader
        title={service.name}
        actions={
          <>
            {service.status !== "not_deployed" && (
              <form action={setStopped}>
                <input type="hidden" name="name" value={service.name} />
                <input type="hidden" name="stopped" value={String(!stopped)} />
                <Button variant="outline">{stopped ? "Start" : "Stop"}</Button>
              </form>
            )}
            <DeleteService name={service.name} />
            {service.url && service.status === "running" && (
              <Button asChild>
                <a href={service.url} target="_blank" rel="noreferrer">
                  Open
                </a>
              </Button>
            )}
          </>
        }
      />
      <div className="grid gap-14 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Facts>
          <Fact label="Status">
            <ServiceStatus status={service.status} />
          </Fact>
          <Fact label="URL">
            {service.url
              ? service.url.replace(/^https?:\/\//, "")
              : "No domain set"}
          </Fact>
          <Fact label="Version">
            {service.version ? `v${service.version}` : "None"}
            {service.deployment &&
              ` · deployed ${timeAgo(service.deployment.created_at)}`}
          </Fact>
          <Fact label="Process">
            {service.process
              ? `pid ${service.process.pid} · ${formatBytes(service.process.memory)} · ${service.process.cpu}% cpu`
              : "Starts on the next request"}
          </Fact>
          <Fact label="Limits">
            {settings.heap_mb} MB heap · {settings.cpu_seconds} s cpu
          </Fact>
          <Fact label="Data">
            {formatBytes(service.bytes)} of {formatBytes(service.disk_quota)}
          </Fact>
          <Fact label="Jobs">
            {service.jobs.queued} queued · {service.jobs.running} running ·{" "}
            {service.jobs.dead} dead
          </Fact>
          <Fact label="Created">{day(service.created_at)}</Fact>
        </Facts>

        <div className="flex min-w-0 flex-col gap-10">
          <section className="flex flex-col gap-3">
            <SectionTitle>Bindings</SectionTitle>
            {service.bindings.length === 0 ? (
              <p className="text-muted-foreground">
                {service.deployment
                  ? "This version declares no bindings."
                  : "Nothing deployed yet."}
              </p>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th className="w-[110px]">Kind</Th>
                    <Th>Name</Th>
                    <Th className="text-right">Detail</Th>
                  </tr>
                </thead>
                <tbody>
                  {service.bindings.map((b) => (
                    <tr key={b.name}>
                      <Td className="py-2.5">
                        <Mono className="text-brand">
                          {b.type.replace(/^service:.*/, "service")}
                        </Mono>
                      </Td>
                      <Td className="py-2.5 font-medium">
                        <span className="font-mono text-[13px]">{b.name}</span>
                      </Td>
                      <Td className="py-2.5 text-right">
                        <Mono>
                          {b.type.startsWith("service:")
                            ? `calls ${b.type.slice(8)}`
                            : bindingDetail(b)}
                        </Mono>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <SectionTitle>Versions</SectionTitle>
            {deployments.length === 0 ? (
              <p className="text-muted-foreground">No versions yet.</p>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th className="w-[60px]" />
                    <Th>Main</Th>
                    <Th className="w-[120px]">Built</Th>
                    <Th className="w-[110px] text-right">When</Th>
                  </tr>
                </thead>
                <tbody>
                  {deployments.slice(0, 8).map((d) => (
                    <tr key={d.id}>
                      <Td className="py-2.5">
                        <Mono
                          className={d.active ? "text-foreground" : undefined}
                        >
                          v{d.number}
                        </Mono>
                      </Td>
                      <Td className="py-2.5">
                        <Mono className="text-foreground">
                          {d.manifest.main}
                        </Mono>
                        {d.error && (
                          <span className="ml-3 text-[13px] text-destructive">
                            {d.error}
                          </span>
                        )}
                      </Td>
                      <Td className="py-2.5">
                        <Mono
                          className={
                            d.status === "failed"
                              ? "text-destructive"
                              : undefined
                          }
                        >
                          {d.status === "ready" ? "ok" : "failed"}
                        </Mono>
                      </Td>
                      <Td className="py-2.5 text-right">
                        {d.active ? (
                          <Mono className="text-brand">current</Mono>
                        ) : d.status === "ready" ? (
                          <form action={activate} className="inline">
                            <input
                              type="hidden"
                              name="name"
                              value={service.name}
                            />
                            <input type="hidden" name="id" value={d.id} />
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto font-mono text-xs font-normal"
                            >
                              {timeAgo(d.created_at)} · use
                            </Button>
                          </form>
                        ) : (
                          <Mono>{timeAgo(d.created_at)}</Mono>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <SectionTitle>Recent logs</SectionTitle>
            <LogLines lines={lines} />
          </section>
        </div>
      </div>
    </>
  )
}
