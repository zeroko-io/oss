"use client"

import { ActionButton } from "@zeroko/ui/components/action"
import { toast } from "@zeroko/ui/components/feedback"

import { runner } from "@/lib/browser"

/** Queues a cron's job now. */
export function RunCron({
  service,
  schedule,
}: {
  service: string
  schedule: string
}) {
  return (
    <ActionButton
      variant="link"
      size="sm"
      className="h-auto font-mono text-[11px] font-normal text-brand"
      pending="queuing"
      run={async () => {
        await runner.runCron(service, schedule)
        toast(`Queued the job of ${schedule}`)
      }}
    >
      run now
    </ActionButton>
  )
}
