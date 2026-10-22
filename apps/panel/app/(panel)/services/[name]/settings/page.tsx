import type { Metadata } from "next"

import { Page } from "@zeroko-io/commons/components/page"
import { ServiceSettings } from "@zeroko-io/commons/views/service/settings"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Service settings" }

export default async function ServiceSettingsPage(
  props: PageProps<"/services/[name]/settings">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  const r = runner()
  const [service, secrets, settings] = await Promise.all([
    r.service(name),
    r.secrets(name),
    r.settings(),
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
