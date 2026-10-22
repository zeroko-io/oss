"use server"
// Everything the panel changes. Each action checks the session first: they
// are reachable with a plain POST.
import { refresh } from "next/cache"
import { redirect } from "next/navigation"
import { RunnerError, type Settings } from "@zeroko/ui/lib/runner"

import { runner } from "./runner"
import {
  checkPassword,
  endSession,
  requireSession,
  startSession,
} from "./session"

export type FormState = { error?: string; done?: boolean; secret?: string }

function failure(err: unknown): FormState {
  if (err instanceof RunnerError) return { error: err.message }
  throw err
}

let failedAt = 0

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  // One wrong password a second, for everyone: enough for one admin.
  if (Date.now() - failedAt < 1000) {
    return { error: "Too many attempts. Wait a second." }
  }
  if (!checkPassword(String(form.get("password") ?? ""))) {
    failedAt = Date.now()
    return { error: "That is not the password." }
  }
  await startSession()
  redirect("/")
}

export async function signOut() {
  await endSession()
  redirect("/login")
}

export async function setStopped(form: FormData) {
  await requireSession()
  const name = String(form.get("name"))
  const r = runner()
  await (form.get("stopped") === "true" ? r.stop(name) : r.start(name))
  refresh()
}

export async function activate(form: FormData) {
  await requireSession()
  await runner().activate(String(form.get("name")), String(form.get("id")))
  refresh()
}

export async function deleteService(form: FormData) {
  await requireSession()
  await runner().deleteService(String(form.get("name")))
  redirect("/")
}

export async function createToken(
  _: FormState,
  form: FormData
): Promise<FormState> {
  await requireSession()
  try {
    const { secret } = await runner().createToken(
      String(form.get("name") ?? "").trim(),
      Number(form.get("expires") ?? 0)
    )
    refresh()
    return { done: true, secret }
  } catch (err) {
    return failure(err)
  }
}

export async function deleteToken(form: FormData) {
  await requireSession()
  await runner().deleteToken(String(form.get("id")))
  refresh()
}

export async function saveSettings(
  _: FormState,
  form: FormData
): Promise<FormState> {
  await requireSession()
  const n = (k: string) => Number(form.get(k))
  const s: Partial<Settings> = {
    domain: String(form.get("domain") ?? "").trim(),
    public_scheme: String(form.get("public_scheme")),
    max_body_mb: n("max_body_mb"),
    heap_mb: n("heap_mb"),
    cpu_seconds: n("cpu_seconds"),
    idle_seconds: n("idle_seconds"),
    max_processes: n("max_processes"),
    disk_mb: n("disk_mb"),
    egress: form.get("egress") === "on",
  }
  const r = runner()
  try {
    await r.setSettings(s)
  } catch (err) {
    return failure(err)
  }
  // The runner restarts with them: wait for it before drawing the page.
  for (let i = 0; i < 40; i++) {
    await new Promise((done) => setTimeout(done, 250))
    if (
      await r.system().then(
        () => true,
        () => false
      )
    )
      break
  }
  refresh()
  return { done: true }
}
