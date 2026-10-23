import type { Metadata } from "next"
import { TokensScreen } from "@zeroko-io/commons/screens/tokens"

import { publicUrl, runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Tokens" }

export default async function TokensPage() {
  await requireSession()
  return (
    <TokensScreen runner={runner()} skill={`${await publicUrl()}/skill.md`} />
  )
}
