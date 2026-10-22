# Zeroko OSS

The open source panel of Zeroko: a web app to manage one
[runner](https://github.com/zeroko-io/runner), and the skill agents read to
deploy services on it. Self-hosted next to the runner.

## Layout

- `apps/panel`: the panel, a Next.js app. Its server talks to the runner's
  API with the root token, which never reaches the browser.
- `packages/ui`: `@zeroko/ui`, Zeroko's look (the theme tokens) and its
  components, shadcn-based, shared with Zeroko's other panels. MIT licensed.
- `skill.md`: what agents read to use Zeroko.

## Develop

```sh
npm install
npm run dev        # the panel at http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

Add a shadcn component to `@zeroko/ui`:

```sh
npx shadcn@latest add dialog -c apps/panel
```
