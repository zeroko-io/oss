import type { Metadata } from "next"

import { Page } from "@zeroko-io/commons/components/page"
import { ServiceSettings } from "@zeroko-io/commons/views/service/settings"
import { loadService, loadSettings, runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Service settings" }

export default async function ServiceSettingsPage(
  props: PageProps<"/services/[name]/settings">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  const r = runner()
  const [service, secrets, settings] = await Promise.all([
    loadService(name),
    r.secrets(name),
    loadSettings(),
  ])
  return (
    <Page>
      <ServiceSettings
        service={service}
        secrets={secrets}
        egressAllowed={settings.egress}
      />
    </Page>
  )
}
