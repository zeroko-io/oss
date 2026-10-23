# Zeroko OSS

The open source panel of Zeroko: a web app to manage one
[runner](https://github.com/zeroko-io/runner), and the skill agents read to
deploy services on it. Self-hosted next to the runner.

## What it does

- Lists the runner's services; for each, its traffic, versions (with their
  code, a quick deploy and uploads), a live log, its data (SQL on its
  databases, its files, jobs and realtime channels) and its settings (egress,
  disk quota, vars, secrets, export and import); stops, starts, rolls back
  and deletes them.
- Makes and revokes the tokens agents deploy with.
- Changes the runner's settings (domain, limits), which restarts it in
  place; tails its log; downloads and restores backups.
- Light and dark, following the system or a fixed choice.
- Serves the agents' skill at `/skill.md`, filled in with its own address and
  the runner's limits, and the runner's API at `/api`, so agents need only
  the panel's address and a token.

The panel's server talks to the runner with the root token, which never
reaches the browser. One admin signs in with a password.

## Install

The panel runs next to a runner; `docker-compose.yml` starts both:

```sh
cp .env.example .env    # set the token and the password
docker compose up -d
```

The panel answers on port 3000 and services on port 8080. **Put a reverse
proxy with TLS in front of both**: one host for the panel (say
`panel.example.com`) and a wildcard for the services (`*.example.com`). Then
sign in and set the domain in System. The runner's API stays inside the
compose network; agents reach it through the panel's `/api`.

## Configure

| Variable                | Meaning                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `ZEROKO_TOKEN`          | The runner's root token (the same value the runner has).       |
| `ZEROKO_PANEL_PASSWORD` | The admin's password, 8 characters or more.                    |
| `ZEROKO_RUNNER_URL`     | The runner's API. Default `http://localhost:8081`.             |
| `ZEROKO_PANEL_URL`      | The panel's public address, when its proxy doesn't send `X-Forwarded-Host` and `X-Forwarded-Proto`. |

The image is `ghcr.io/zeroko-io/oss` (`dev` follows `main`; releases are
`X.Y.Z`, `X.Y` and `latest`), for amd64 and arm64.

Changing the token or the password signs the admin out.

## Layout

- `apps/panel`: the panel, a Next.js app. `skill.md` is the skill's
  template.
- `packages/commons`: `@zeroko-io/commons`, Zeroko's look, "Ledger" (the theme tokens and
  components), and a client for the runner's API; shared with Zeroko's
  other panels.

## Develop

Run a runner (see its README), then put its token in
`apps/panel/.env.local`:

```sh
ZEROKO_TOKEN=...
ZEROKO_PANEL_PASSWORD=...
ZEROKO_RUNNER_URL=http://localhost:8081
```

```sh
npm install
npm run dev        # the panel at http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

`@zeroko-io/commons` is not published: Zeroko's other panels include this
repository as a git submodule and use it as a workspace, each pinned to a
commit of it. Changes here reach them only when they move that pin, so keep
commons' exports working, or say in `CHANGELOG.md` what changed.

Add a shadcn component to `@zeroko-io/commons`:

```sh
npx shadcn@latest add dialog -c apps/panel
```

MIT licensed.
