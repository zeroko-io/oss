import type { Metadata } from "next"
import { ServiceSettingsScreen } from "@zeroko-io/commons/screens/service"

import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Service settings" }

export default async function ServiceSettingsPage(
  props: PageProps<"/services/[name]/settings">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  return <ServiceSettingsScreen runner={runner()} root="" name={name} />
}
