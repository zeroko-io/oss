"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  ActionButton,
  ErrorDetails,
  FileButton,
} from "@zeroko/ui/components/action"
import { Button } from "@zeroko/ui/components/button"
import { confirm, toast } from "@zeroko/ui/components/feedback"
import { Input } from "@zeroko/ui/components/input"
import { Mono } from "@zeroko/ui/components/ledger"
import { relative } from "@zeroko/ui/lib/format"
import type {
  Deployment,
  DeploymentView,
  ServiceDetail,
  Source,
} from "@zeroko/ui/lib/runner"
import { cn } from "@zeroko/ui/lib/utils"

import { runner } from "@/lib/browser"

const SHOWN = 8

export function Versions({
  service,
  deployments,
}: {
  service: ServiceDetail
  deployments: DeploymentView[]
}) {
  const router = useRouter()
  const [all, setAll] = useState(false)
  const [writing, setWriting] = useState(false)
  const list = all ? deployments : deployments.slice(0, SHOWN)

  const deployed = (d: Deployment) => {
    if (d.status === "ready") toast(`v${d.number} is live`)
    else
      toast(
        `v${d.number} failed${d.error ? `: ${d.error.split("\n")[0]}` : ""}`,
        true
      )
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-end gap-2.5">
        <FileButton
          accept=".json,application/json"
          run={async ([file]) => {
            let body
            try {
              body = JSON.parse(await file!.text())
            } catch {
              throw new Error(
                `${file!.name} is not a deployment; download one from this list.`
              )
            }
            if (
              !(await confirm(
                `Deploy ${file!.name} to ${service.name}?`,
                "Deploy",
                { danger: false }
              ))
            )
              return
            deployed(await runner.deploy(service.name, body))
          }}
        >
          Upload a bundle
        </FileButton>
        <Button
          variant={writing ? "ghost" : "default"}
          aria-expanded={writing}
          onClick={() => setWriting(!writing)}
        >
          {writing ? "Cancel" : "Deploy code"}
        </Button>
      </div>

      {writing && (
        <QuickDeploy
          service={service}
          onDone={(d) => {
            setWriting(false)
            deployed(d)
          }}
        />
      )}

      {deployments.length === 0 ? (
        <p className="py-10 text-center font-serif text-muted-foreground italic">
          Not deployed yet. Agents deploy through the API; the skill says how.
        </p>
      ) : (
        <ul className="flex flex-col border-t">
          {list.map((d) => (
            <VersionRow
              key={d.id}
              service={service.name}
              d={d}
              onActivate={async () => {
                await runner.activate(service.name, d.id)
                toast(`v${d.number} is live`)
                router.refresh()
              }}
            />
          ))}
        </ul>
      )}
      {deployments.length > SHOWN && (
        <Button
          variant="link"
          size="sm"
          className="self-start"
          onClick={() => setAll(!all)}
        >
          {all ? "Show fewer" : `Show all ${deployments.length}`}
        </Button>
      )}
    </div>
  )
}

function VersionRow({
  service,
  d,
  onActivate,
}: {
  service: string
  d: DeploymentView
  onActivate: () => Promise<void>
}) {
  const [source, setSource] = useState<Source | null>(null)
  const m = d.manifest
  const bindings = Object.keys(m?.bindings ?? {})
  return (
    <li className="flex flex-col gap-2 border-b border-rule py-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span
          className={cn(
            "font-serif text-xl",
            !d.active && "text-muted-foreground"
          )}
        >
          v{d.number}
        </span>
        {d.active && <Mono className="text-brand">live</Mono>}
        {d.status === "failed" && (
          <Mono className="text-destructive">failed</Mono>
        )}
        <Mono>{relative(d.created_at)}</Mono>
        <div className="ml-auto flex items-center gap-1">
          <ActionButton
            variant="ghost"
            size="sm"
            aria-expanded={!!source}
            run={async () =>
              setSource(source ? null : await runner.source(service, d.id))
            }
          >
            {source ? "Hide code" : "Code"}
          </ActionButton>
          <Button variant="ghost" size="sm" asChild>
            <a
              href={runner.bundleUrl(service, d.id)}
              download
              title="Download, to deploy it again here or elsewhere"
            >
              Download
            </a>
          </Button>
          {d.status === "ready" && !d.active && (
            <ActionButton
              variant="outline"
              size="sm"
              pending="Switching"
              run={onActivate}
            >
              Make live
            </ActionButton>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1">
        {m?.main && <Mono className="text-foreground">{m.main}</Mono>}
        {bindings.length > 0 && <Mono>{bindings.join(", ")}</Mono>}
        {!!m?.crons?.length && (
          <Mono>{m.crons.map((c) => c.schedule).join(", ")}</Mono>
        )}
        <Mono className="text-faint">{d.id}</Mono>
      </div>
      {d.error && <ErrorDetails error={d.error} />}
      {source && <SourceView source={source} />}
    </li>
  )
}

/** The files of a version, as they were sent. */
function SourceView({ source }: { source: Source }) {
  const names = Object.keys(source.files).sort((a, b) =>
    a === source.main ? -1 : b === source.main ? 1 : a.localeCompare(b)
  )
  const [file, setFile] = useState(names[0] ?? "")
  const text = source.files[file]
  return (
    <div className="mt-2 flex animate-in flex-col gap-2 duration-200 fade-in slide-in-from-top-1">
      <div className="flex flex-wrap gap-1">
        {names.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={n === file}
            onClick={() => setFile(n)}
            className={cn(
              "rounded-sm px-2 py-0.5 font-mono text-xs transition-colors",
              n === file
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <pre className="max-h-[440px] overflow-auto rounded-lg border bg-field p-4 font-mono text-xs leading-relaxed">
        {text ?? "A binary file."}
      </pre>
    </div>
  )
}

const SAMPLE = `export default {
  async fetch(request, env) {
    return Response.json({ hello: "world" });
  },
};
`

/** Deploys one module, keeping the bindings, crons and vars of the live
 * version. */
function QuickDeploy({
  service,
  onDone,
}: {
  service: ServiceDetail
  onDone: (d: Deployment) => void
}) {
  const [busy, setBusy] = useState(false)
  const m = service.manifest
  return (
    <form
      className="flex animate-in flex-col gap-4 rounded-lg border bg-card p-5 duration-200 fade-in slide-in-from-top-1"
      onSubmit={async (e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const main = String(f.get("main")).trim()
        setBusy(true)
        try {
          onDone(
            await runner.deploy(service.name, {
              main,
              files: { [main]: String(f.get("code")) },
              bindings: m?.bindings,
              crons: m?.crons,
              vars: m?.vars,
            })
          )
        } catch (err) {
          toast(err, true)
        } finally {
          setBusy(false)
        }
      }}
    >
      <label className="flex flex-col gap-2">
        <span className="kicker">Main module</span>
        <Input
          name="main"
          defaultValue={m?.main ?? "index.js"}
          required
          className="max-w-xs font-mono"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="kicker">Code</span>
        <textarea
          name="code"
          rows={12}
          defaultValue={SAMPLE}
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
              e.currentTarget.form?.requestSubmit()
          }}
          className="rounded-lg border bg-field p-3 font-mono text-xs leading-relaxed outline-none focus-visible:border-ring"
        />
      </label>
      <p className="text-[13px] text-muted-foreground">
        Keeps the live version&apos;s bindings, crons and vars.
      </p>
      <div>
        <Button disabled={busy}>{busy ? "Deploying" : "Deploy"}</Button>
      </div>
    </form>
  )
}
