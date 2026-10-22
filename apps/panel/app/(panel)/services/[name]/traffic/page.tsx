import type { Metadata } from "next"
import Link from "next/link"
import { RequestChart } from "@zeroko/ui/components/chart"
import { Stat, Stats } from "@zeroko/ui/components/ledger"
import { formatNumber, latency, rate } from "@zeroko/ui/lib/format"
import type { Period } from "@zeroko/ui/lib/runner"
import { cn } from "@zeroko/ui/lib/utils"

import { Page } from "@/components/page"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Traffic" }

const periods: Period[] = ["1h", "24h", "7d", "30d"]

export default async function TrafficPage(
  props: PageProps<"/services/[name]/traffic">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  const asked = (await props.searchParams).period
  const period = periods.find((p) => p === asked) ?? "24h"
  const data = await runner().metrics(name, period)
  const t = data.totals
  const base = `/services/${encodeURIComponent(name)}/traffic`
  return (
    <Page>
      <div className="flex items-center justify-end">
        <nav
          aria-label="Period"
          className="inline-flex rounded-lg border p-0.5 font-mono text-[11px] tracking-[0.06em] uppercase"
        >
          {periods.map((p) => (
            <Link
              key={p}
              href={`${base}?period=${p}`}
              scroll={false}
              aria-current={p === period ? "page" : undefined}
              className={cn(
                "inline-flex h-6 items-center rounded-sm px-2.5 transition-colors",
                p === period
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </Link>
          ))}
        </nav>
      </div>
      <Stats className="md:grid-cols-5">
        <Stat label="Requests" value={formatNumber(t.requests)} />
        <Stat
          label="5xx errors"
          value={formatNumber(t.errors)}
          unit={t.requests ? rate(t.errors, t.requests) : undefined}
        />
        <Stat label="Exceptions" value={formatNumber(t.exceptions)} />
        <Stat
          label="Duration p95"
          value={latency(t.p95)}
          unit={t.requests ? `p50 ${latency(t.p50)}` : undefined}
        />
        <Stat
          label="Outbound"
          value={formatNumber(t.outbound)}
          unit={
            t.outbound_errors
              ? `${formatNumber(t.outbound_errors)} failed`
              : undefined
          }
        />
      </Stats>
      {t.requests > 0 ? (
        <RequestChart key={period} data={data} />
      ) : (
        <p className="py-10 text-center font-serif text-muted-foreground italic">
          No requests in this period.
        </p>
      )}
    </Page>
  )
}
