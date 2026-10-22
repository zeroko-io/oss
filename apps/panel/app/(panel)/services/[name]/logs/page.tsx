import type { Metadata } from "next"

import { Page } from "@zeroko-io/commons/components/page"
import { ServiceLogs } from "@zeroko-io/commons/views/service/logs"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Logs" }

export default async function LogsPage(
  props: PageProps<"/services/[name]/logs">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  return (
    <Page>
      <ServiceLogs key={name} name={name} />
    </Page>
  )
}
