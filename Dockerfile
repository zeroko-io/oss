# syntax=docker/dockerfile:1
# The panel's image. It's built on the machine's own platform: the result is
# plain JavaScript, so the image for another platform only copies files and
# needs no emulation.

FROM --platform=$BUILDPLATFORM node:lts-alpine AS build
WORKDIR /src
COPY package.json package-lock.json turbo.json ./
COPY apps/panel/package.json apps/panel/
COPY packages/commons/package.json packages/commons/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/typescript-config/package.json packages/typescript-config/
RUN npm ci --no-audit --no-fund
COPY . .
ARG VERSION=dev
ENV NEXT_TELEMETRY_DISABLED=1 VERSION=$VERSION
RUN npm run build -w @zeroko/panel

FROM node:lts-alpine
ARG VERSION=dev
LABEL org.opencontainers.image.title="Zeroko OSS" \
      org.opencontainers.image.description="The open source panel of Zeroko" \
      org.opencontainers.image.source="https://github.com/zeroko-io/oss" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version=$VERSION
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build --chown=node:node /src/apps/panel/.next/standalone ./
COPY --from=build --chown=node:node /src/apps/panel/.next/static ./apps/panel/.next/static
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "apps/panel/server.js"]
