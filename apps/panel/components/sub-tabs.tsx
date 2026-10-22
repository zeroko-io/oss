"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef } from "react"
import { TabLink, TabNav } from "@zeroko/ui/components/ledger"

import { Pending, scrollUpTo } from "@/components/links"

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
