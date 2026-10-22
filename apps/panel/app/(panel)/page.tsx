import type { Metadata } from "next"
import Link from "next/link"
import { CopyButton } from "@zeroko/ui/components/copy-button"
import {
  Mono,
  PageHeader,
  Stat,
  Stats,
  Table,
  Td,
  Th,
} from "@zeroko/ui/components/ledger"
import { bytesParts, formatNumber, timeAgo } from "@zeroko/ui/lib/format"

import { ServiceStatus } from "@/components/service-status"
import { publicUrl, runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Services" }

function summary(n: number, running: number): string {
  if (n === 0) return "Nothing deployed yet."
  const of = n === 1 ? "One service" : `${formatNumber(n)} services`
  if (running === n)
    return n === 1 ? "One service, running." : `${of}, all running.`
  if (running === 0) return `${of}, none running.`
  return `${of}, ${formatNumber(running)} running.`
}

export default async function ServicesPage() {
  await requireSession()
  const r = runner()
  const [services, system, settings, base] = await Promise.all([
    r.services(),
    r.system(),
    r.settings(),
    publicUrl(),
  ])
  const metrics = await Promise.all(
    services.map((s) => r.metrics(s.name).catch(() => null))
  )
  const requests = metrics.reduce((n, m) => n + (m?.totals.requests ?? 0), 0)
  const errors = metrics.reduce((n, m) => n + (m?.totals.errors ?? 0), 0)
  const [disk, diskUnit] = bytesParts(system.data_bytes)
  const running = services.filter((s) => s.status === "running").length
  const skill = `${base}/skill.md`

  return (
    <>
      <PageHeader
        kicker={`Runner · ${system.version}`}
        title="Services"
        note={summary(services.length, running)}
        actions={
          <CopyButton variant="outline" text={skill}>
            Copy skill URL
          </CopyButton>
        }
      />
      <Stats>
        <Stat label="Requests · 24h" value={formatNumber(requests)} />
        <Stat
          label="Error rate"
          value={requests ? ((errors / requests) * 100).toFixed(1) : "0"}
          unit="%"
        />
        <Stat
          label="Processes"
          value={system.processes.length}
          unit={`/ ${settings.max_processes}`}
        />
        <Stat label="Data" value={disk} unit={diskUnit} />
      </Stats>
      {services.length === 0 ? (
        <div className="flex flex-col gap-3 border-l border-brand py-1 pl-5">
          <p className="font-serif text-xl">Give your agent the skill.</p>
          <p className="max-w-[560px] leading-relaxed text-muted-foreground">
            Point Claude or any agent at{" "}
            <span className="font-mono text-foreground">{skill}</span> with a
            token from the Tokens page, and ask it for a service. It shows up
            here.
          </p>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th className="w-[220px]">Name</Th>
              <Th>URL</Th>
              <Th className="w-[150px]">Status</Th>
              <Th className="w-[110px] text-right">Requests</Th>
              <Th className="w-[130px] text-right">Version</Th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={s.id} className="group">
                <Td>
                  <Link
                    href={`/services/${encodeURIComponent(s.name)}`}
                    className="font-medium underline-offset-4 group-hover:underline"
                  >
                    {s.name}
                  </Link>
                </Td>
                <Td>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer">
                      <Mono className="hover:text-foreground">
                        {s.url.replace(/^https?:\/\//, "")}
                      </Mono>
                    </a>
                  ) : (
                    <Mono>Set a domain in System</Mono>
                  )}
                </Td>
                <Td>
                  <ServiceStatus status={s.status} />
                </Td>
                <Td className="text-right">
                  <Mono
                    className={
                      metrics[i]?.totals.requests
                        ? "text-foreground"
                        : undefined
                    }
                  >
                    {formatNumber(metrics[i]?.totals.requests ?? 0)}
                  </Mono>
                </Td>
                <Td className="text-right">
                  <Mono>
                    {s.version ? `v${s.version}` : "–"}
                    {s.latest && ` · ${timeAgo(s.latest.created_at)}`}
                  </Mono>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
