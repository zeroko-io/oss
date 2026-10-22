"use client"

// The runner as the browser reaches it, for the shared views: each panel
// says where (the oss panel through /runner-api, with the admin's session;
// cloud through its own route for the team's runner).
import * as React from "react"

import { Runner } from "@zeroko-io/commons/lib/runner"

const RunnerContext = React.createContext<Runner | null>(null)

function RunnerProvider({
  base,
  children,
}: {
  base: string
  children: React.ReactNode
}) {
  const runner = React.useMemo(() => new Runner(base), [base])
  return <RunnerContext value={runner}>{children}</RunnerContext>
}

function useRunner(): Runner {
  const runner = React.use(RunnerContext)
  if (!runner) throw new Error("useRunner needs a RunnerProvider above it.")
  return runner
}

export { RunnerProvider, useRunner }
