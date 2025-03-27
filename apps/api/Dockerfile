FROM node:23.10.0-slim AS base

# --- install pnpm / turbo ---
FROM base AS builder

RUN npm install -g pnpm@10.7.0 turbo@2.4.4

ENV PNPM_HOME=/app/.pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NODE_OPTIONS="--max_old_space_size=4096"

WORKDIR /usr/src

COPY turbo.json package*.json pnpm*.yaml ./
COPY packages/ ./packages
COPY apps/ ./apps

# reduces source code pre install/build
RUN turbo prune api --docker

# --- copy, install, build and prune ---
FROM builder AS build
WORKDIR /usr/app

COPY --from=builder /usr/src/out/json/ .
COPY --from=builder /usr/src/out/full/ .

RUN corepack install

# full install incl. dev deps
RUN pnpm --filter=api... install --frozen-lockfile

RUN turbo run build --filter=api...

# would like to strip dev deps (like ts + prettier) post install/build.
# `pnpm prune --prod` doesnt seem to work within monorepos so removing manually
RUN rm -rf /usr/app/node_modules/.pnpm-store
RUN rm -rf /usr/app/node_modules/.cache
RUN rm -rf /usr/app/node_modules/.pnpm/@types* /usr/app/node_modules/.pnpm/eslint* /usr/app/node_modules/.pnpm/prettier*

# --- runtime-only image ---
FROM base AS final
WORKDIR /app

# could shrink this by copying less files however pnpm symlink breaks when copying node_modules
COPY --from=build /usr/app ./

USER node
EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "/app/apps/api/dist/main.js"]