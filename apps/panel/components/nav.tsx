"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TabLink, TabNav } from "@zeroko/ui/components/ledger"

const tabs = [
  {
    href: "/",
    label: "Services",
    match: (p: string) => p === "/" || p.startsWith("/services"),
  },
  {
    href: "/tokens",
    label: "Tokens",
    match: (p: string) => p.startsWith("/tokens"),
  },
  {
    href: "/system",
    label: "System",
    match: (p: string) => p.startsWith("/system"),
  },
]

export function Nav() {
  const path = usePathname()
  return (
    <TabNav>
      {tabs.map((t) => (
        <TabLink key={t.href} asChild active={t.match(path)}>
          <Link href={t.href}>{t.label}</Link>
        </TabLink>
      ))}
    </TabNav>
  )
}
