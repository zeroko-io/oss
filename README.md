# Zeroko OSS

The open source panel of Zeroko: a web app to manage one
[runner](https://github.com/zeroko-io/runner), and the skill agents read to
deploy services on it. Self-hosted next to the runner.

```sh
cp .env.example .env    # set the token and the password
docker compose up -d    # then put a reverse proxy with TLS in front
```

The docs are at [zeroko.io/docs](https://zeroko.io/docs): installing, the
panel, the runner and the API. What changed is in the
[changelog](CHANGELOG.md).

## Develop

Run a runner, then put its token in `apps/panel/.env.local`
(`ZEROKO_TOKEN`, `ZEROKO_PANEL_PASSWORD`, `ZEROKO_RUNNER_URL`):

```sh
npm install
npm run dev        # the panel at http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

`packages/commons` (`@zeroko-io/commons`) is Zeroko's look, components and
runner client, shared with Zeroko's other panels, which use it from this
repository pinned to a commit: keep its exports working, or say in
`CHANGELOG.md` what changed.

MIT licensed.
