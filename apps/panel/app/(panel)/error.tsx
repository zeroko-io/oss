"use client"

import { Button } from "@zeroko-io/commons/components/button"
import { PageHeader } from "@zeroko-io/commons/components/ledger"

export default function PanelError({
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <PageHeader
      title="Something went wrong"
      note="The runner may have restarted, or refused the request. The panel's log has the details."
      actions={<Button onClick={reset}>Try again</Button>}
    />
  )
}
