import { cn } from "@zeroko/ui/lib/utils"

function Bar({ className }: { className?: string }) {
  return (
    <span
      className={cn("block animate-pulse rounded-sm bg-secondary", className)}
    />
  )
}

/** What a page looks like while it loads: its title, figures and rows. */
export function PageSkeleton({ title = true }: { title?: boolean }) {
  return (
    <div
      aria-busy
      aria-label="Loading"
      className="flex animate-in flex-col gap-8 delay-150 duration-300 fill-mode-both fade-in"
    >
      {title && (
        <div className="flex flex-col gap-3">
          <Bar className="h-3 w-28" />
          <Bar className="h-9 w-56" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-6 border-y py-5 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <Bar className="h-2.5 w-20" />
            <Bar className="h-7 w-16" />
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-6 border-b border-rule py-4">
            <Bar className="h-3.5 w-32" />
            <Bar className="h-3.5 flex-1 opacity-60" />
            <Bar className="h-3.5 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
