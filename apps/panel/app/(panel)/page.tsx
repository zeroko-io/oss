import type { Metadata } from "next"
import { PageHeader, Stat, Stats } from "@zeroko-io/commons/components/ledger"
import { bytesParts, formatNumber } from "@zeroko-io/commons/lib/format"

import { TopLink } from "@zeroko-io/commons/components/navigation"
import { AutoRefresh } from "@zeroko-io/commons/components/auto-refresh"
import { Page } from "@zeroko-io/commons/components/page"
import { NewService, ServicesTable } from "@zeroko-io/commons/views/services"
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
  const requests = Object.fromEntries(
    services.map((s, i) => [s.id, metrics[i]?.totals.requests ?? 0])
  )
  const total = metrics.reduce((n, m) => n + (m?.totals.requests ?? 0), 0)
  const errors = metrics.reduce((n, m) => n + (m?.totals.errors ?? 0), 0)
  const [disk, diskUnit] = bytesParts(system.data_bytes)
  const running = services.filter((s) => s.status === "running").length
  const skill = `${base}/skill.md`

  return (
    <Page>
      <AutoRefresh />
      <PageHeader
        title="Services"
        note={summary(services.length, running)}
        actions={<NewService domain={settings.domain} />}
      />
      <Stats>
        <Stat label="Requests - 24h" value={formatNumber(total)} />
        <Stat
          label="Error rate"
          value={total ? ((errors / total) * 100).toFixed(1) : "0"}
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
        <div className="flex animate-in flex-col gap-3 border-l border-brand py-1 pl-5 duration-500 fade-in slide-in-from-bottom-1">
          <p className="font-serif text-xl">Give your agent the skill.</p>
          <p className="max-w-[560px] leading-relaxed text-muted-foreground">
            Make a token in{" "}
            <TopLink href="/tokens" className="text-foreground underline">
              Tokens
            </TopLink>
            , point Claude or any agent at{" "}
            <span className="font-mono text-foreground">{skill}</span>, and ask
            it for a service. It shows up here.
          </p>
        </div>
      ) : (
        <ServicesTable services={services} requests={requests} />
      )}
    </Page>
  )
}
