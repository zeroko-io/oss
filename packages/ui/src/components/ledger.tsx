// The pieces of the Ledger look: the logo, page titles, figures, ruled
// tables, status marks and log lines. Server components, no state.
import * as React from "react"
import { cn } from "cn"
import { Slot } from "radix-ui"

function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2.5 font-serif text-[19px] tracking-[-0.01em] text-foreground",
        className
      )}
    >
      <span aria-hidden className="size-3 bg-brand" />
      zeroko
    </span>
  )
}

function Kicker({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("kicker", className)} {...props} />
}

function PageHeader({
  kicker,
  title,
  note,
  actions,
  className,
}: {
  kicker?: React.ReactNode
  title: React.ReactNode
  note?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-end gap-4", className)}>
      <div className="flex min-w-0 flex-col gap-2">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h1 className="font-serif text-[38px] leading-none font-normal tracking-[-0.015em] break-words">
          {title}
        </h1>
        {note && (
          <p className="font-serif text-base text-muted-foreground italic">
            {note}
          </p>
        )}
      </div>
      {actions && <div className="ml-auto flex gap-2.5">{actions}</div>}
    </div>
  )
}

function SectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("font-serif text-xl font-normal", className)}
      {...props}
    />
  )
}

function Stats({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 border-y md:grid-cols-4 [&>*]:border-border md:[&>*:not(:first-child)]:pl-6 md:[&>*:not(:last-child)]:border-r",
        className
      )}
      {...props}
    />
  )
}

function Stat({
  label,
  value,
  unit,
}: {
  label: React.ReactNode
  value: React.ReactNode
  unit?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2.5 py-[18px]">
      <Kicker>{label}</Kicker>
      <span className="font-serif text-[32px] leading-none tracking-[-0.01em]">
        {value}
        {unit && (
          <span className="text-[17px] text-muted-foreground"> {unit}</span>
        )}
      </span>
    </div>
  )
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <table
      className={cn("w-full border-collapse text-left", className)}
      {...props}
    />
  )
}

function Th({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "border-b pr-5 pb-2.5 kicker font-normal last:pr-0",
        className
      )}
      {...props}
    />
  )
}

function Td({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "border-b border-rule py-3.5 pr-5 align-middle last:pr-0",
        className
      )}
      {...props}
    />
  )
}

function Mono({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("font-mono text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

type Tone = "ok" | "warn" | "error" | "idle"

const toneText: Record<Tone, string> = {
  ok: "text-ok",
  warn: "text-warn",
  error: "text-destructive",
  idle: "text-muted-foreground",
}

const toneMark: Record<Tone, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  error: "bg-destructive",
  idle: "border border-muted-foreground",
}

function Status({
  tone,
  children,
  className,
}: {
  tone: Tone
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        toneText[tone],
        className
      )}
    >
      <span aria-hidden className={cn("size-[7px] shrink-0", toneMark[tone])} />
      {children}
    </span>
  )
}

function Facts({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col border-t", className)} {...props} />
}

function Fact({
  label,
  children,
}: {
  label: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-rule py-3.5">
      <span className="kicker">{label}</span>
      <span className="font-mono text-xs break-all">{children}</span>
    </div>
  )
}

function FieldRow({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: React.ReactNode
  hint?: React.ReactNode
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-3 border-b border-rule py-[18px] md:grid-cols-[300px_360px] md:gap-12">
      <div className="flex flex-col gap-1">
        <label htmlFor={htmlFor} className="font-medium">
          {label}
        </label>
        {hint && (
          <span className="text-[13px] leading-snug text-muted-foreground">
            {hint}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

function TabNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      className={cn(
        "flex self-stretch font-mono text-[11.5px] tracking-[0.09em] uppercase",
        className
      )}
      {...props}
    />
  )
}

function TabLink({
  active,
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & { active?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  return (
    <Comp
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center border-b px-3.5 no-underline transition-colors",
        active
          ? "border-brand text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SideLink({
  active,
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & { active?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"
  return (
    <Comp
      aria-current={active ? "page" : undefined}
      className={cn(
        "border-l py-1.5 pl-3 no-underline",
        active
          ? "border-brand text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

type LogTone = "info" | "brand" | "warn" | "error" | "idle"

const logTone: Record<LogTone, string> = {
  info: "text-info",
  brand: "text-brand",
  warn: "text-warn",
  error: "text-destructive",
  idle: "text-muted-foreground",
}

function LogLines({
  lines,
  empty = "Nothing logged yet.",
  className,
}: {
  lines: {
    id: React.Key
    time: string
    kind: string
    tone: LogTone
    message: string
  }[]
  empty?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[7px] border-l border-brand py-0.5 pl-[18px] font-mono text-xs",
        className
      )}
    >
      {lines.length === 0 && (
        <span className="text-muted-foreground">{empty}</span>
      )}
      {lines.map((l) => (
        <div key={l.id} className="flex gap-[18px]">
          <span className="shrink-0 text-faint">{l.time}</span>
          <span className={cn("w-[60px] shrink-0", logTone[l.tone])}>
            {l.kind}
          </span>
          <span className="min-w-0 break-words whitespace-pre-wrap">
            {l.message}
          </span>
        </div>
      ))}
    </div>
  )
}

function Meter({
  label,
  used,
  total,
  ratio,
}: {
  label: React.ReactNode
  used: React.ReactNode
  total: React.ReactNode
  ratio: number
}) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-rule py-4">
      <div className="flex items-baseline">
        <span className="font-medium">{label}</span>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          <span className="text-foreground">{used}</span> / {total}
        </span>
      </div>
      <div className="h-0.5 bg-rule">
        <div
          className="h-0.5 bg-brand"
          style={{ width: `${Math.min(100, Math.max(0, ratio * 100))}%` }}
        />
      </div>
    </div>
  )
}

export {
  Fact,
  Facts,
  FieldRow,
  Kicker,
  LogLines,
  Logo,
  Meter,
  Mono,
  PageHeader,
  SectionTitle,
  SideLink,
  Stat,
  Stats,
  Status,
  TabLink,
  TabNav,
  Table,
  Td,
  Th,
  type LogTone,
  type Tone,
}
