// A client for a runner's API, for server code only: it carries a token.
// The types follow the runner's JSON; fields the panels don't read are left
// out.

export type ServiceStatus = "running" | "stopped" | "not_deployed"

export type Deployment = {
  id: string
  number: number
  status: "ready" | "failed"
  error?: string
  created_at: number
}

export type Manifest = {
  main: string
  bindings?: Record<string, string>
  crons?: { schedule: string }[]
  vars?: Record<string, string>
  assets?: number
}

export type Service = {
  id: string
  name: string
  created_at: number
  active_deployment?: string
  stopped: boolean
  egress: string[]
  disk_mb: number
  url: string
  status: ServiceStatus
  version?: number
  latest?: Deployment
}

export type Process = {
  pid: number
  started: number
  busy: number
  memory: number
  cpu: number
}

export type ServiceDetail = Service & {
  deployment?: Deployment
  manifest?: Manifest
  bindings: { name: string; type: string; bytes?: number; count?: number }[]
  jobs: { queued: number; running: number; dead: number }
  connections: number
  bytes: number
  disk_quota: number
  process?: Process
  vars: { name: string; value: string; updated_at: number }[]
}

export type DeploymentView = Deployment & {
  active: boolean
  manifest: Manifest
}

export type LogEntry = {
  id: number
  deployment: string
  ts: number
  source: "request" | "console" | "fetch" | "runtime"
  level: string
  message: string
}

export type MetricsPoint = {
  t: number
  requests: number
  errors: number
  exceptions: number
  outbound: number
  outbound_errors: number
  p50: number
  p95: number
}

export type Metrics = {
  period: string
  step: number
  points: MetricsPoint[]
  totals: MetricsPoint
}

export type Token = {
  id: string
  name: string
  prefix: string
  created_at: number
  last_used_at: number
  expires_at: number
}

export type Settings = {
  domain: string
  public_scheme: string
  max_body_mb: number
  heap_mb: number
  cpu_seconds: number
  idle_seconds: number
  max_processes: number
  disk_mb: number
  egress: boolean
}

export type System = {
  version: string
  workerd: string
  started: number
  services: number
  processes: (Process & { service: string })[]
  disk: { total: number; free: number }
  data_bytes: number
}

export class RunnerError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string
  ) {
    super(message)
  }
}

export class Runner {
  constructor(
    readonly base: string,
    private readonly token: string
  ) {}

  /** Calls the runner's API: path starts with /api. */
  async fetch(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers)
    headers.set("Authorization", `Bearer ${this.token}`)
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }
    return fetch(this.base + path, { ...init, headers, cache: "no-store" })
  }

  private async call<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await this.fetch(path, init)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new RunnerError(
        res.status,
        body?.error?.code ?? "error",
        body?.error?.message ?? `The runner answered ${res.status}.`
      )
    }
    return (res.status === 204 ? undefined : await res.json()) as T
  }

  private send<T>(method: string, path: string, body?: unknown) {
    return this.call<T>(path, {
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  }

  services = () => this.call<Service[]>("/api/services")
  service = (name: string) =>
    this.call<ServiceDetail>(`/api/services/${encodeURIComponent(name)}`)
  createService = (name: string) =>
    this.send<Service>("POST", "/api/services", { name })
  deleteService = (name: string) =>
    this.send<void>("DELETE", `/api/services/${encodeURIComponent(name)}`)
  stop = (name: string) =>
    this.send<Service>("POST", `/api/services/${encodeURIComponent(name)}/stop`)
  start = (name: string) =>
    this.send<Service>(
      "POST",
      `/api/services/${encodeURIComponent(name)}/start`
    )
  deployments = (name: string) =>
    this.call<DeploymentView[]>(
      `/api/services/${encodeURIComponent(name)}/deployments`
    )
  activate = (name: string, id: string) =>
    this.send<Deployment>(
      "POST",
      `/api/services/${encodeURIComponent(name)}/deployments/${encodeURIComponent(id)}/activate`
    )
  logs = (name: string, opts: { after?: number; limit?: number } = {}) =>
    this.call<LogEntry[]>(
      `/api/services/${encodeURIComponent(name)}/logs?after=${opts.after ?? 0}&limit=${opts.limit ?? 200}`
    )
  metrics = (name: string, period: "1h" | "24h" | "7d" | "30d" = "24h") =>
    this.call<Metrics>(
      `/api/services/${encodeURIComponent(name)}/metrics?period=${period}`
    )

  tokens = () => this.call<Token[]>("/api/tokens")
  createToken = (name: string, expiresInDays = 0) =>
    this.send<{ secret: string; token: Token }>("POST", "/api/tokens", {
      name,
      expires_in_days: expiresInDays,
    })
  deleteToken = (id: string) =>
    this.send<void>("DELETE", `/api/tokens/${encodeURIComponent(id)}`)

  settings = () => this.call<Settings>("/api/settings")
  setSettings = (s: Partial<Settings>) =>
    this.send<Settings>("PATCH", "/api/settings", s)
  system = () => this.call<System>("/api/system")
}
