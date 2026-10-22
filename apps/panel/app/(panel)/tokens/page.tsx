import type { Metadata } from "next"
import { Button } from "@zeroko/ui/components/button"
import { CopyButton } from "@zeroko/ui/components/copy-button"
import {
  Mono,
  PageHeader,
  SectionTitle,
  Table,
  Td,
  Th,
} from "@zeroko/ui/components/ledger"
import { day, timeAgo } from "@zeroko/ui/lib/format"

import { CreateToken } from "@/components/create-token"
import { deleteToken } from "@/lib/actions"
import { publicUrl, runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = { title: "Tokens" }

export default async function TokensPage() {
  await requireSession()
  const [tokens, base] = await Promise.all([runner().tokens(), publicUrl()])
  const skill = `${base}/skill.md`
  const now = Date.now()
  return (
    <>
      <PageHeader
        kicker="Runner · tokens"
        title="Tokens"
        note="What your agents use to deploy. Each one can do everything the panel can."
      />
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-w-0 flex-col gap-3">
          {tokens.length === 0 ? (
            <p className="text-muted-foreground">
              No tokens yet. Make one for each agent or machine.
            </p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th className="w-[130px]">Token</Th>
                  <Th className="w-[110px]">Last used</Th>
                  <Th className="w-[110px]">Expires</Th>
                  <Th className="w-[70px]" />
                </tr>
              </thead>
              <tbody>
                {tokens.map((t) => {
                  const expired = t.expires_at > 0 && t.expires_at < now
                  return (
                    <tr key={t.id}>
                      <Td className="font-medium">{t.name}</Td>
                      <Td>
                        <Mono>{t.prefix}…</Mono>
                      </Td>
                      <Td>
                        <Mono>
                          {t.last_used_at
                            ? timeAgo(t.last_used_at, now)
                            : "never"}
                        </Mono>
                      </Td>
                      <Td>
                        <Mono
                          className={expired ? "text-destructive" : undefined}
                        >
                          {t.expires_at
                            ? expired
                              ? "expired"
                              : day(t.expires_at)
                            : "never"}
                        </Mono>
                      </Td>
                      <Td className="text-right">
                        <form action={deleteToken}>
                          <input type="hidden" name="id" value={t.id} />
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto font-normal hover:text-destructive"
                          >
                            Revoke
                          </Button>
                        </form>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </section>
        <aside className="flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <SectionTitle>New token</SectionTitle>
            <CreateToken skill={skill} />
          </section>
          <section className="flex flex-col gap-3 border-l border-brand py-0.5 pl-[18px]">
            <span className="kicker text-brand">The skill</span>
            <p className="leading-relaxed text-muted-foreground">
              Agents learn Zeroko from{" "}
              <span className="font-mono text-[13px] text-foreground">
                {skill}
              </span>
              . Give them that address and a token.
            </p>
            <div>
              <CopyButton variant="outline" size="sm" text={skill}>
                Copy skill URL
              </CopyButton>
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}
