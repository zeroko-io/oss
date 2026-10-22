import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-input bg-field px-3 text-[13px] text-foreground transition-colors outline-none placeholder:text-faint focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-9 w-full rounded-lg border border-input bg-field px-2.5 text-[13px] text-foreground outline-none focus-visible:border-ring",
        className
      )}
      {...props}
    />
  )
}

export { Input, Select }
