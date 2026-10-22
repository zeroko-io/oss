import type { Metadata } from "next"

import { Page } from "@/components/page"
import { ServiceLogs } from "@/components/service/logs"
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
