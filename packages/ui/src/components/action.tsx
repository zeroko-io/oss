"use client"

// Buttons that run something: busy while it runs, its error as a toast.
import * as React from "react"
import { cn } from "cn"

import { Button, buttonVariants } from "@zeroko/ui/components/button"
import { toast } from "@zeroko/ui/components/feedback"

type ButtonProps = React.ComponentProps<typeof Button>

/** Runs an async action on click; shows `pending` while it runs. */
function ActionButton({
  run,
  pending: pendingLabel,
  children,
  disabled,
  ...props
}: Omit<ButtonProps, "onClick"> & {
  run: () => Promise<unknown>
  pending?: React.ReactNode
}) {
  const [busy, setBusy] = React.useState(false)
  return (
    <Button
      type="button"
      disabled={busy || disabled}
      aria-busy={busy || undefined}
      onClick={async () => {
        setBusy(true)
        try {
          await run()
        } catch (err) {
          toast(err, true)
        } finally {
          setBusy(false)
        }
      }}
      {...props}
    >
      {busy && pendingLabel ? pendingLabel : children}
    </Button>
  )
}

/** Picks a file and runs an action with it. */
function FileButton({
  accept,
  run,
  multiple,
  variant = "outline",
  size,
  className,
  children,
}: {
  accept?: string
  run: (files: File[]) => Promise<unknown>
  multiple?: boolean
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
  children: React.ReactNode
}) {
  const [busy, setBusy] = React.useState(false)
  return (
    <label
      aria-busy={busy || undefined}
      className={cn(
        buttonVariants({ variant, size }),
        "cursor-pointer",
        busy && "pointer-events-none opacity-50",
        className
      )}
    >
      {children}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        disabled={busy}
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? [])
          e.target.value = ""
          if (!files.length) return
          setBusy(true)
          try {
            await run(files)
          } catch (err) {
            toast(err, true)
          } finally {
            setBusy(false)
          }
        }}
      />
    </label>
  )
}

/** A choice among a few options, as a row of small mono buttons. */
function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: {
  value: T
  options: readonly (readonly [T, React.ReactNode])[]
  onChange: (value: T) => void
  label: string
  className?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-lg border p-0.5 font-mono text-[11px] tracking-[0.06em] uppercase",
        className
      )}
    >
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={v === value}
          onClick={() => onChange(v)}
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-sm px-2.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            v === value
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {text}
        </button>
      ))}
    </div>
  )
}

/** The first line of an error and, folded, the rest. */
function ErrorDetails({
  error,
  className,
}: {
  error: string
  className?: string
}) {
  const [first, ...rest] = error.split("\n")
  const more = rest.join("\n").trim()
  const base = cn("font-mono text-xs wrap-anywhere text-destructive", className)
  if (!more) return <p className={base}>{first}</p>
  return (
    <details className={cn("group", base)}>
      <summary className="flex cursor-pointer list-none items-baseline gap-2 [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="text-faint transition-transform duration-200 group-open:rotate-90"
        >
          ›
        </span>
        {first}
      </summary>
      <pre className="mt-2 overflow-auto rounded-lg border bg-field p-3 whitespace-pre-wrap text-muted-foreground">
        {more}
      </pre>
    </details>
  )
}

export { ActionButton, ErrorDetails, FileButton, Segmented }
