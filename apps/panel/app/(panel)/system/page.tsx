import type { Metadata } from "next"
import {
  Fact,
  Facts,
  Meter,
  Mono,
  SectionTitle,
  Stat,
  Stats,
  Table,
  Td,
  Th,
  Tr,
} from "@zeroko/ui/components/ledger"
import {
  bytesParts,
  duration,
  formatBytes,
  relative,
} from "@zeroko/ui/lib/format"

import { AutoRefresh } from "@/components/auto-refresh"
import { Page } from "@/components/page"
import { SettingsForm } from "@/components/settings-form"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "System" }

export default async function SystemPage() {
  await requireSession()
  const r = runner()
  const [system, settings] = await Promise.all([r.system(), r.settings()])
  const used = system.disk.total - system.disk.free
  const memory = system.processes.reduce((n, p) => n + p.memory, 0)
  const [data, dataUnit] = bytesParts(system.data_bytes)
  const [free, freeUnit] = bytesParts(system.disk.free)
  return (
    <Page>
      <AutoRefresh every={10000} />
      <Stats className="md:grid-cols-5">
        <Stat label="Uptime" value={duration(Date.now() - system.started)} />
        <Stat label="Services" value={system.services} />
        <Stat
          label="Processes"
          value={system.processes.length}
          unit={`/ ${settings.max_processes}`}
        />
        <Stat label="Service data" value={data} unit={dataUnit} />
        <Stat label="Disk free" value={free} unit={freeUnit} />
      </Stats>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="flex flex-col gap-4">
          <SectionTitle>Settings</SectionTitle>
          <SettingsForm settings={settings} />
        </section>
        <aside className="flex flex-col gap-8">
          <Facts>
            <Fact label="Runner">{system.version}</Fact>
            <Fact label="workerd">{system.workerd || "unknown"}</Fact>
            <Fact label="Started">{relative(system.started)}</Fact>
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
              <div className="flex items-baseline justify-between">
                <SectionTitle className="text-lg">Running now</SectionTitle>
                <Mono>{formatBytes(memory)}</Mono>
              </div>
              <Table>
                <thead>
                  <tr>
                    <Th>Service</Th>
                    <Th className="text-right">Memory</Th>
                    <Th className="text-right">CPU</Th>
                  </tr>
                </thead>
                <tbody>
                  {system.processes.map((p) => (
                    <Tr key={p.pid}>
                      <Td className="py-2.5">
                        <Mono className="text-foreground">{p.service}</Mono>
                      </Td>
                      <Td className="py-2.5 text-right">
                        <Mono>{formatBytes(p.memory)}</Mono>
                      </Td>
                      <Td className="py-2.5 text-right">
                        <Mono>{p.cpu}%</Mono>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </section>
          )}
        </aside>
      </div>
    </Page>
  )
}
