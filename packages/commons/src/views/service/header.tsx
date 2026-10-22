"use client"

import { ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { ActionButton } from "@zeroko-io/commons/components/action"
import { Button } from "@zeroko-io/commons/components/button"
import { confirm, toast } from "@zeroko-io/commons/components/feedback"
import type { Service } from "@zeroko-io/commons/lib/runner"

import { useRunner } from "@zeroko-io/commons/components/runner"

export function ServiceActions({ service }: { service: Service }) {
  const runner = useRunner()
  const router = useRouter()
  const live = service.status !== "not_deployed"
  return (
    <>
      {live && (
        <ActionButton
          variant="outline"
          pending={service.stopped ? "Starting" : "Stopping"}
          run={async () => {
            const stop = !service.stopped
            if (
              stop &&
              !(await confirm(
                `Stop ${service.name}? It answers 503 and runs no jobs or crons until you start it.`,
                "Stop"
              ))
            )
              return
            await (stop
              ? runner.stop(service.name)
              : runner.start(service.name))
            toast(stop ? `${service.name} stopped` : `${service.name} started`)
            router.refresh()
          }}
        >
          {service.stopped ? "Start" : "Stop"}
        </ActionButton>
      )}
      {live && service.url && (
        <Button asChild>
          <a href={service.url} target="_blank" rel="noreferrer">
            Open <ArrowUpRight aria-hidden />
          </a>
        </Button>
      )}
    </>
  )
}
