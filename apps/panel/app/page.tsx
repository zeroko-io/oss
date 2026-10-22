import { Button } from "@zeroko/ui/components/button"

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-start gap-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Zeroko</h1>
      <div className="flex gap-2">
        <Button>Deploy</Button>
        <Button variant="secondary">Logs</Button>
        <Button variant="outline">Settings</Button>
        <Button variant="destructive">Delete</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="text-ok">running</span> - <span className="text-warn">queued</span> -{" "}
        <span className="text-info">deploying</span>
      </p>
    </main>
  )
}
