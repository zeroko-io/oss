import type { Metadata } from "next"

import { Page } from "@/components/page"
import { DataExplorer } from "@/components/service/data"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Data" }

export default async function DataPage(
  props: PageProps<"/services/[name]/data">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  const r = runner()
  const [service, stores] = await Promise.all([
    r.service(name),
    r.storage(name),
  ])
  return (
    <Page>
      <DataExplorer service={service} stores={stores} />
    </Page>
  )
}
