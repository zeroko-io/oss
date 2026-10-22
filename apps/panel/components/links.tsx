"use client"

import Link, { useLinkStatus } from "next/link"
import { cn } from "@zeroko/ui/lib/utils"

/** Whether a click should navigate here, rather than open a tab. */
function plain(e: React.MouseEvent) {
  return !(
    e.defaultPrevented ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey ||
    e.button !== 0
  )
}

/** Goes to the top of the page first, then to another page. Next would
 * scroll after the new page is drawn, in the middle of the view transition,
 * so the page would slide from where the old one was scrolled to. */
export function TopLink({
  onClick,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      scroll={false}
      onClick={(e) => {
        onClick?.(e)
        if (plain(e)) window.scrollTo({ top: 0 })
      }}
      {...props}
    />
  )
}

/** Scrolls up to an element if the page is scrolled past it, so tabs stay
 * in view when what is under them changes length. */
export function scrollUpTo(el: Element | null, offset = 72) {
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  if (window.scrollY > top) window.scrollTo({ top })
}

/** A faint line under a tab while its page loads. Lives inside a Link. */
export function Pending() {
  const { pending } = useLinkStatus()
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-3.5 bottom-0 h-px bg-foreground/40 opacity-0 transition-opacity duration-300",
        pending && "animate-pulse opacity-100 delay-100"
      )}
    />
  )
}
