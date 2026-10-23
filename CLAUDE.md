@AGENTS.md

# Zeroko OSS

The open source panel for one Zeroko runner (`zeroko-io/runner`), and
`@zeroko-io/commons`, the look and components shared with the commercial panel
(`zeroko-io/cloud`). Develop on Windows with Node and npm; no WSL.

## Principles

- The runner's API is the source of truth: the panel's server calls it with
  the root token; the browser never sees that token or the runner itself.
- Every page calls `requireSession()` first. Pages render on the server with
  the root token; what the browser changes goes through `/runner-api`, which
  checks the session and the origin and adds the token, so the runner's own
  errors reach the page (as toasts). Server Actions are only for signing in
  and out.
- Anything both panels need (theme, components, views of a service, the
  runner's API client) goes in `packages/commons`, not in `apps/panel`.
  Views take the runner from `useRunner()`, never a panel's own module.
- One look, "Ledger": colors, radii and fonts are the tokens in
  `packages/commons/src/styles/globals.css`, each `light-dark()`: the theme follows
  the system unless the `zeroko_theme` cookie fixes it. Hairline rules, not
  cards; a serif (Lora) for titles and figures, Geist for the interface,
  Geist Mono for labels, names and logs. Components use the tokens, never raw
  colors. The accent is one token, `--brand`, and may still change.
  Customize shadcn components in place rather than wrapping them.
- What users and agents deploy are services (not apps).
- `apps/panel/skill.md` is the agents' contract: update it with any change to
  what they can do.
- No docs in this repository: every doc is on the website (zeroko.io/docs,
  written in the private `zeroko-io/cloud`). Keep the README short.

## Layout

- `apps/panel`: Next.js (App Router) app. `lib/`: config from the
  environment, the session, the runner client, the Server Actions.
  `app/(panel)`: the signed-in pages; a service's and the system's tabs are
  routes. `components/`: the client pieces of those pages.
  `app/api/[...path]`: the runner's API passed through for agents, with their
  own token. `app/runner-api/[...path]`: the same API for the panel's pages,
  with the session. `app/skill.md`: the skill.
- Motion: pages enter through `<Page>` (React's `ViewTransition`); links
  into something pass `transitionTypes={["nav-forward"]}`, links back
  `["nav-back"]`. Keep animations short and honor reduced motion.
- `packages/commons`: `@zeroko-io/commons`, not published: the private
  `zeroko-io/cloud` includes this repository as a submodule (at `oss/`) and
  uses it as a workspace, pinned to a commit. This repository never needs
  cloud; changes reach cloud only when it moves the pin. Keep commons'
  exports stable, and note in `CHANGELOG.md` what changes for its users.
  `src/styles/globals.css` (tokens); `src/components`: the look
  (`ledger.tsx`), feedback (toasts, confirm), actions, the log view, the
  chart, navigation (links that scroll first, sub-tabs), `page.tsx` (view
  transitions), `runner.tsx` (`RunnerProvider`, `useRunner`: how the views
  reach the runner from the browser); `src/views`: the screens of a service,
  the services table and tokens; `src/lib`: the runner client and types,
  formats, the theme.
- `packages/eslint-config`, `packages/typescript-config`: shared configs.

## Commands

```sh
npm install
npm run dev
npm run typecheck && npm run lint && npm run build
npx shadcn@latest add <component> -c apps/panel   # into packages/commons
```

## Releases

CI (`.github/workflows/ci.yml`) works like the runner's. On `main` (and
pull requests) it type-checks, lints, checks formatting, builds the image and
checks that it starts; on `main` it publishes it for amd64 and arm64 as
`sha-<commit>` and, while the commit is `main`'s newest, `dev`. The image's
last stage only copies files, so arm64 needs no emulation: keep it so.

Versions come from git: `git describe` of the `vX.Y.Z` tags, passed to the
build as `VERSION`. To release: turn `## Unreleased` in `CHANGELOG.md` into
`## X.Y.Z`, commit, tag `vX.Y.Z` and push both at once
(`git push --atomic origin main vX.Y.Z`). Once `main`'s run of the commit
passes, the tag's run names that image `X.Y.Z`, `X.Y` and `latest` and
makes the GitHub release from the changelog.
