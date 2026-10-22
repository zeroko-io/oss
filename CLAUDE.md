@AGENTS.md

# Zeroko OSS

The open source panel for one Zeroko runner (`zeroko-io/runner`), and
`@zeroko/ui`, the look and components shared with the commercial panel
(`zeroko-io/cloud`). Develop on Windows with Node and npm; no WSL.

## Principles

- The runner's API is the source of truth: the panel's server calls it with
  the root token; the browser never sees that token or the runner itself.
- Anything both panels need (theme, components, views of a service, the
  runner's API client) goes in `packages/ui`, not in `apps/panel`.
- One look: colors, radii and fonts are the tokens in
  `packages/ui/src/styles/globals.css`. Dark, always; components use the
  tokens, never raw colors. Customize shadcn components in place rather than
  wrapping them.
- What users and agents deploy are services (not apps).
- `skill.md` is the agents' contract: update it with any change to what they
  can do.

## Layout

- `apps/panel`: Next.js (App Router) app.
- `packages/ui`: `@zeroko/ui`; `src/styles/globals.css` (tokens),
  `src/components` (shadcn-based components), `src/lib`, `src/hooks`.
- `packages/eslint-config`, `packages/typescript-config`: shared configs.

## Commands

```sh
npm install
npm run dev
npm run typecheck && npm run lint && npm run build
npx shadcn@latest add <component> -c apps/panel   # into packages/ui
```
