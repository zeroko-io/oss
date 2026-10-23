import type { Metadata } from "next"
import { ServiceLogsScreen } from "@zeroko-io/commons/screens/service"

import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Logs" }

export default async function LogsPage(
  props: PageProps<"/services/[name]/logs">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  return <ServiceLogsScreen name={name} />
}
