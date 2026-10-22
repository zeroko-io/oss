@AGENTS.md

# Zeroko OSS

The open source panel for one Zeroko runner (`zeroko-io/runner`), and
`@zeroko/ui`, the look and components shared with the commercial panel
(`zeroko-io/cloud`). Develop on Windows with Node and npm; no WSL.

## Principles

- The runner's API is the source of truth: the panel's server calls it with
  the root token; the browser never sees that token or the runner itself.
- Every page and every Server Action calls `requireSession()` first: actions
  are reachable with a plain POST.
- Anything both panels need (theme, components, views of a service, the
  runner's API client) goes in `packages/ui`, not in `apps/panel`.
- One look, "Ledger": colors, radii and fonts are the tokens in
  `packages/ui/src/styles/globals.css`. Dark, always; hairline rules, not
  cards; a serif (Lora) for titles and figures, Geist for the interface,
  Geist Mono for labels, names and logs. Components use the tokens, never raw
  colors. The accent is one token, `--brand`, and may still change.
  Customize shadcn components in place rather than wrapping them.
- What users and agents deploy are services (not apps).
- `apps/panel/skill.md` is the agents' contract: update it with any change to
  what they can do.

## Layout

- `apps/panel`: Next.js (App Router) app. `lib/`: config from the
  environment, the session, the runner client, the Server Actions.
  `app/(panel)`: the signed-in pages. `app/api/[...path]`: the runner's API
  passed through for agents. `app/skill.md`: the skill.
- `packages/ui`: `@zeroko/ui`; `src/styles/globals.css` (tokens),
  `src/components` (`ledger.tsx` has the look's pieces), `src/lib/runner.ts`
  (the API client and types), `src/lib/format.ts`.
- `packages/eslint-config`, `packages/typescript-config`: shared configs.

## Commands

```sh
npm install
npm run dev
npm run typecheck && npm run lint && npm run build
npx shadcn@latest add <component> -c apps/panel   # into packages/ui
```
