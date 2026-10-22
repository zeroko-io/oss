import type { Metadata } from "next"

import { Page } from "@zeroko-io/commons/components/page"
import { Versions } from "@zeroko-io/commons/views/service/versions"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Versions" }

export default async function VersionsPage(
  props: PageProps<"/services/[name]/versions">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  const r = runner()
  const [service, deployments] = await Promise.all([
    r.service(name),
    r.deployments(name),
  ])
  return (
    <Page>
      <Versions service={service} deployments={deployments} />
    </Page>
  )
}
