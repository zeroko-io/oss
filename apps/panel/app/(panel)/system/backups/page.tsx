import type { Metadata } from "next"

import { Page } from "@zeroko-io/commons/components/page"
import { Backups } from "@/components/system"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Backups" }

export default async function BackupsPage() {
  await requireSession()
  return (
    <Page>
      <Backups />
    </Page>
  )
}
