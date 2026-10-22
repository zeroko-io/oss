"use client"

import { useActionState } from "react"
import { Button } from "@zeroko/ui/components/button"
import { Input, Select } from "@zeroko/ui/components/input"
import { FieldRow } from "@zeroko/ui/components/ledger"
import type { Settings } from "@zeroko/ui/lib/runner"

import { saveSettings } from "@/lib/actions"

function NumberField({
  name,
  label,
  hint,
  unit,
  value,
}: {
  name: keyof Settings
  label: string
  hint: string
  unit: string
  value: number
}) {
  return (
    <FieldRow label={label} hint={hint} htmlFor={name}>
      <Input
        id={name}
        name={name}
        type="number"
        min={1}
        required
        defaultValue={value}
        className="font-mono"
      />
      <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground">
        {unit}
      </span>
    </FieldRow>
  )
}

export function SettingsForm({ settings: s }: { settings: Settings }) {
  const [state, action, pending] = useActionState(saveSettings, {})
  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col border-t">
        <FieldRow
          label="Domain"
          hint="Services answer at name.domain. Point a wildcard record here."
          htmlFor="domain"
        >
          <Input
            id="domain"
            name="domain"
            defaultValue={s.domain}
            placeholder="example.com"
            className="font-mono"
          />
        </FieldRow>
        <FieldRow
          label="Public scheme"
          hint="How service URLs start: behind a TLS proxy, https."
          htmlFor="public_scheme"
        >
          <Select
            id="public_scheme"
            name="public_scheme"
            defaultValue={s.public_scheme}
            className="font-mono"
          >
            <option value="https">https</option>
            <option value="http">http</option>
          </Select>
        </FieldRow>
        <NumberField
          name="heap_mb"
          label="Memory per service"
          hint="Heap for each service's process."
          unit="MB"
          value={s.heap_mb}
        />
        <NumberField
          name="cpu_seconds"
          label="CPU per request"
          hint="Busy time before the process restarts."
          unit="s"
          value={s.cpu_seconds}
        />
        <NumberField
          name="idle_seconds"
          label="Idle timeout"
          hint="A process with no work stops after this."
          unit="s"
          value={s.idle_seconds}
        />
        <NumberField
          name="max_processes"
          label="Processes"
          hint="Services running at once; the idlest stops first."
          unit=""
          value={s.max_processes}
        />
        <NumberField
          name="disk_mb"
          label="Disk per service"
          hint="Default quota for databases and files."
          unit="MB"
          value={s.disk_mb}
        />
        <NumberField
          name="max_body_mb"
          label="Request body"
          hint="Largest body a service accepts."
          unit="MB"
          value={s.max_body_mb}
        />
        <FieldRow
          label="Outbound network"
          hint="Lets services call the internet, unless a service says otherwise."
          htmlFor="egress"
        >
          <label className="flex items-center gap-2.5">
            <input
              id="egress"
              name="egress"
              type="checkbox"
              defaultChecked={s.egress}
              className="size-4 accent-brand"
            />
            <span className="text-[13px]">Allowed</span>
          </label>
        </FieldRow>
      </div>
      <div className="flex items-center gap-4">
        <Button disabled={pending}>
          {pending ? "Restarting" : "Save and restart"}
        </Button>
        {state.error && (
          <span className="text-[13px] text-destructive">{state.error}</span>
        )}
        {state.done && !pending && (
          <span className="font-mono text-xs text-ok">
            Saved. The runner restarted.
          </span>
        )}
      </div>
    </form>
  )
}
