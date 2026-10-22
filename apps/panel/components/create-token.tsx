"use client"

import { useActionState } from "react"
import { Button } from "@zeroko/ui/components/button"
import { CopyButton } from "@zeroko/ui/components/copy-button"
import { Input, Select } from "@zeroko/ui/components/input"

import { createToken } from "@/lib/actions"

export function CreateToken({ skill }: { skill: string }) {
  const [state, action, pending] = useActionState(createToken, {})
  if (state.secret) {
    const prompt = `Use the Zeroko skill at ${skill} with the token ${state.secret}`
    return (
      <div className="flex flex-col gap-4">
        <p className="text-[13px] leading-snug text-muted-foreground">
          Copy it now: the runner keeps only its hash, so it won&apos;t be shown
          again.
        </p>
        <code className="rounded-lg border bg-field px-3 py-2.5 font-mono text-xs break-all">
          {state.secret}
        </code>
        <div className="flex flex-wrap gap-2">
          <CopyButton size="sm" text={state.secret}>
            Copy token
          </CopyButton>
          <CopyButton size="sm" variant="outline" text={prompt}>
            Copy for an agent
          </CopyButton>
        </div>
        <Button
          variant="link"
          size="sm"
          className="self-start"
          onClick={() => location.reload()}
        >
          Make another
        </Button>
      </div>
    )
  }
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="kicker">Name</span>
        <Input
          name="name"
          required
          maxLength={100}
          placeholder="claude on my laptop"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="kicker">Expires</span>
        <Select name="expires" defaultValue="90">
          <option value="30">In 30 days</option>
          <option value="90">In 90 days</option>
          <option value="365">In a year</option>
          <option value="0">Never</option>
        </Select>
      </label>
      {state.error && (
        <span className="text-[13px] text-destructive">{state.error}</span>
      )}
      <div>
        <Button disabled={pending}>
          {pending ? "Creating" : "Create token"}
        </Button>
      </div>
    </form>
  )
}
