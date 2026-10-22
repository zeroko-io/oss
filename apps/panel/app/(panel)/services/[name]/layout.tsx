import { notFound } from "next/navigation"
import { CopyButton } from "@zeroko/ui/components/copy-button"
import { Kicker, PageHeader } from "@zeroko/ui/components/ledger"
import { RunnerError } from "@zeroko/ui/lib/runner"

import { TopLink } from "@/components/links"
import { AutoRefresh } from "@/components/auto-refresh"
import { Page, ServiceName } from "@/components/page"
import { ServiceActions } from "@/components/service/header"
import { ServiceStatus } from "@/components/service-status"
import { SubTabs } from "@/components/sub-tabs"
import { runner } from "@/lib/runner"
import { requireSession } from "@/lib/session"

export default async function ServiceLayout(
  props: LayoutProps<"/services/[name]">
) {
  await requireSession()
  const name = decodeURIComponent((await props.params).name)
  const service = await runner()
    .service(name)
    .catch((err) => {
      if (err instanceof RunnerError && err.status === 404) notFound()
      throw err
    })
  const base = `/services/${encodeURIComponent(service.name)}`
  return (
    <Page>
      <AutoRefresh />
      <Kicker>
        <TopLink
          href="/"
          transitionTypes={["nav-back"]}
          className="hover:text-foreground"
        >
          Services
        </TopLink>{" "}
        / <span className="text-foreground">{service.name}</span>
      </Kicker>
      <PageHeader
        shared={false}
        title={<ServiceName id={service.id}>{service.name}</ServiceName>}
        note={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-sm not-italic">
            <ServiceStatus status={service.status} />
            {service.url && (
              <span className="flex items-center gap-1">
                <a
                  href={service.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs hover:text-foreground"
                >
                  {service.url.replace(/^https?:\/\//, "")}
                </a>
                <CopyButton
                  text={service.url}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1.5 font-mono text-[11px] font-normal"
                >
                  copy
                </CopyButton>
              </span>
            )}
          </span>
        }
        actions={<ServiceActions service={service} />}
      />
      <SubTabs
        base={base}
        group="service"
        tabs={[
          ["", "Overview"],
          ["traffic", "Traffic"],
          ["versions", "Versions"],
          ["logs", "Logs"],
          ["data", "Data"],
          ["settings", "Settings"],
        ]}
      />
      {props.children}
    </Page>
  )
}
