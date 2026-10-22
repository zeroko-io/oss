import { PageHeader } from "@zeroko/ui/components/ledger"

import { Page } from "@/components/page"
import { SubTabs } from "@/components/sub-tabs"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export default async function SystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSession()
  const settings = await runner().settings()
  return (
    <Page>
      <PageHeader
        title="System"
        note={
          <span className="font-mono text-xs not-italic">
            {settings.domain || "no domain yet"}
          </span>
        }
      />
      <SubTabs
        base="/system"
        group="system"
        tabs={[
          ["", "Overview"],
          ["logs", "Logs"],
          ["backups", "Backups"],
        ]}
      />
      {children}
    </Page>
  )
}
