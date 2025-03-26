FROM node:23.10.0-alpine3.21 AS base

# --- install pnpm / turbo ---
FROM base AS builder

RUN npm install -g pnpm@10.7.0 turbo@2.4.4

ENV PNPM_HOME=/app/.pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NODE_OPTIONS="--max_old_space_size=4096"

# --- copy over pruned app code ---
FROM builder AS src
WORKDIR /usr/src

COPY turbo.json package*.json pnpm*.yaml ./
COPY packages/ ./packages
COPY apps/ ./apps

# reduces source code pre install/build
RUN turbo prune api --docker

# --- copy, install, build annd prune ---
FROM builder AS build
WORKDIR /usr/app

COPY --from=src /usr/src/out/json/ .
COPY --from=src /usr/src/out/full/ .

RUN corepack install

# full install incl. dev deps
RUN pnpm --filter=api... install --frozen-lockfile 

RUN pnpm --filter=api... build

# strip dev deps (like ts + prettier) post install/build
RUN pnpm prune --prod              

# --- runtime-only image ---
FROM base AS final
WORKDIR /app

COPY --from=build /usr/app/apps/api/dist ./apps/api/dist
COPY --from=build /usr/app/node_modules ./node_modules
COPY --from=build /usr/app/package.json ./package.json

USER node
EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "/app/apps/api/dist/main.js"]