import type { Metadata } from "next"
import { ServicesScreen } from "@zeroko-io/commons/screens/services"

import { publicUrl, runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Services" }

export default async function ServicesPage() {
  await requireSession()
  return (
    <ServicesScreen
      runner={runner()}
      root=""
      skill={`${await publicUrl()}/skill.md`}
    />
  )
}
