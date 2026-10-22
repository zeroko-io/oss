import type { Metadata } from "next"
import {
  Fact,
  Facts,
  Meter,
  Mono,
  PageHeader,
  SectionTitle,
  Table,
  Td,
  Th,
} from "@zeroko/ui/components/ledger"
import { formatBytes, timeAgo } from "@zeroko/ui/lib/format"

import { SettingsForm } from "@/components/settings-form"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "System" }

export default async function SystemPage() {
  await requireSession()
  const r = runner()
  const [system, settings] = await Promise.all([r.system(), r.settings()])
  const used = system.disk.total - system.disk.free
  return (
    <>
      <PageHeader
        kicker="Runner · system"
        title="System"
        note="Changing a setting restarts the runner in place."
      />
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px]">
        <SettingsForm settings={settings} />
        <aside className="flex flex-col gap-8">
          <Facts>
            <Fact label="Runner">{system.version}</Fact>
            <Fact label="workerd">{system.workerd || "unknown"}</Fact>
            <Fact label="Started">{timeAgo(system.started)}</Fact>
            <Fact label="Services">{system.services}</Fact>
            {system.disk.total > 0 && (
              <Meter
                label="Disk"
                used={formatBytes(used)}
                total={formatBytes(system.disk.total)}
                ratio={used / system.disk.total}
              />
            )}
            <Meter
              label="Processes"
              used={system.processes.length}
              total={settings.max_processes}
              ratio={system.processes.length / settings.max_processes}
            />
          </Facts>
          {system.processes.length > 0 && (
            <section className="flex flex-col gap-3">
              <SectionTitle className="text-lg">Running now</SectionTitle>
              <Table>
                <thead>
                  <tr>
                    <Th>Service</Th>
                    <Th className="text-right">Memory</Th>
                  </tr>
                </thead>
                <tbody>
                  {system.processes.map((p) => (
                    <tr key={p.pid}>
                      <Td className="py-2.5">
                        <Mono className="text-foreground">{p.service}</Mono>
                      </Td>
                      <Td className="py-2.5 text-right">
                        <Mono>{formatBytes(p.memory)}</Mono>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </section>
          )}
        </aside>
      </div>
    </>
  )
}
