"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TabLink, TabNav } from "@zeroko/ui/components/ledger"

/** A page's own tabs, under its title; tab "" is the base path. */
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
  const current = path.slice(base.length).replace(/^\//, "").split("/")[0]
  return (
    <TabNav className="-mt-2 h-10 [scrollbar-width:none] overflow-x-auto border-b">
      {tabs.map(([t, label]) => (
        <TabLink key={t} asChild group={group} active={current === t}>
          <Link href={t ? `${base}/${t}` : base} scroll={false}>
            {label}
          </Link>
        </TabLink>
      ))}
    </TabNav>
  )
}
