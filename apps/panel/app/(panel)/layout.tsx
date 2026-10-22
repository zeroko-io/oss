import { Button } from "@zeroko/ui/components/button"
import { Logo, Mono, PageHeader } from "@zeroko/ui/components/ledger"

import { Nav } from "@/components/nav"
import { signOut } from "@/lib/actions"
import { config } from "@/lib/config"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSession()
  const settings = await runner()
    .settings()
    .catch(() => null)
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-14 shrink-0 items-center gap-9 border-b px-6 md:px-14">
        <Logo />
        <Nav />
        <Mono className="ml-auto hidden md:inline">
          {settings?.domain || "no domain"}
        </Mono>
        <span className="hidden h-4 w-px bg-border md:inline" />
        <form action={signOut} className="ml-auto md:ml-0">
          <Button variant="link" className="h-auto font-normal">
            Sign out
          </Button>
        </form>
      </header>
      <main className="mx-auto flex w-full max-w-[1280px] grow flex-col gap-8 px-6 py-11 md:px-14">
        {settings ? (
          children
        ) : (
          <PageHeader
            kicker="Runner unreachable"
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
        )}
      </main>
    </div>
  )
}
