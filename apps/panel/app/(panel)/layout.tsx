import { cookies } from "next/headers"
import { ConfirmDialog, Toaster } from "@zeroko/ui/components/feedback"
import { Logo, Mono, PageHeader } from "@zeroko/ui/components/ledger"
import { SubmitButton } from "@zeroko/ui/components/submit-button"
import { ThemeSwitch } from "@zeroko/ui/components/theme-switch"
import { parseTheme, THEME_COOKIE } from "@zeroko/ui/lib/theme"

import { TopLink } from "@/components/links"
import { Nav } from "@/components/nav"
import { Page } from "@/components/page"
import { signOut } from "@/lib/actions"
import { config } from "@/lib/config"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"
import { panelVersion } from "@/lib/updates"

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSession()
  const r = runner()
  const [settings, system, jar] = await Promise.all([
    r.settings().catch(() => null),
    r.system().catch(() => null),
    cookies(),
  ])
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 bg-background/80 shadow-[inset_0_-1px_0_var(--border)] backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-x-4 px-6 md:gap-x-9 md:px-14">
          <TopLink
            href="/"
            aria-label="Services"
            className="flex h-14 items-center"
          >
            <Logo />
          </TopLink>
          <Nav className="order-last -mx-3.5 h-11 w-[calc(100%+1.75rem)] overflow-x-auto md:order-0 md:mx-0 md:h-14 md:w-auto" />
          <div className="ml-auto flex h-14 items-center gap-3 md:gap-5">
            <Mono className="hidden lg:inline">
              {settings?.domain || "no domain"}
            </Mono>
            <span className="hidden h-4 w-px bg-border lg:inline" />
            <form action={signOut}>
              <SubmitButton
                variant="link"
                className="h-auto font-normal"
                pending="Signing out"
              >
                Sign out
              </SubmitButton>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[1280px] grow flex-col px-6 pt-11 pb-20 md:px-14">
        {settings ? (
          children
        ) : (
          <Page>
            <PageHeader
              title="The runner isn't answering"
              note={
                <>
                  The panel calls it at{" "}
                  <span className="font-mono not-italic">
                    {config().runnerUrl}
                  </span>
                  . Check that it is running and that ZEROKO_TOKEN matches.
                </>
              }
            />
          </Page>
        )}
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-1 px-6 py-5 font-mono text-[11px] text-faint md:px-14">
          <span>Zeroko OSS {panelVersion}</span>
          {system && <span>runner {system.version}</span>}
          <a href="/skill.md" className="ml-auto hover:text-foreground">
            Agent skill
          </a>
          <a
            href="https://github.com/zeroko-io/oss"
            className="hover:text-foreground"
          >
            Source
          </a>
          <ThemeSwitch
            initial={parseTheme(jar.get(THEME_COOKIE)?.value)}
            className="-my-1"
          />
        </div>
      </footer>
      <Toaster />
      <ConfirmDialog />
    </div>
  )
}
