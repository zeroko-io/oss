"use client"

import Link, { useLinkStatus } from "next/link"
import { usePathname } from "next/navigation"
import { useRef } from "react"
import { TabLink, TabNav } from "@zeroko-io/commons/components/ledger"
import { cn } from "@zeroko-io/commons/lib/utils"

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

/** A page's own tabs, under its title; tab "" is the base path. Switching
 * keeps the page where it is, unless it was scrolled past the tabs. */
export function SubTabs({
  base,
  group,
  tabs,
}: {
  base: string
  group: string
  tabs: readonly (readonly [string, string])[]
}) {
  const path = usePathname()
  const nav = useRef<HTMLElement>(null)
  const current = path.slice(base.length).replace(/^\//, "").split("/")[0]
  return (
    <TabNav
      ref={nav}
      className="-mt-2 h-10 overflow-x-auto shadow-[inset_0_-1px_0_var(--border)]"
    >
      {tabs.map(([t, label]) => (
        <TabLink key={t} asChild group={group} active={current === t}>
          <Link
            href={t ? `${base}/${t}` : base}
            scroll={false}
            onClick={() => scrollUpTo(nav.current)}
          >
            {label}
            <Pending />
          </Link>
        </TabLink>
      ))}
    </TabNav>
  )
}
