# 🚀 Startup boilerplate

A monorepo boilerplate using Turborepo, designed to help you ship full-stack applications fast.

Includes a NestJS API, a Next.js frontend, and a suite of shared packages for scalable development.

### Apps and Packages

    .
    ├── apps
    │   ├── api                         # NestJS app (https://nestjs.com).
    │   └── frontend                    # Next.js app (https://nextjs.org).
    └── packages
        ├── @common/api                 # Shared `NestJS` resources.
        ├── @common/eslint-config       # `eslint` configurations (includes `prettier`)
        ├── @common/jest-config         # `jest` configurations
        ├── @common/typescript-config   # `tsconfig.json`s used throughout the monorepo
        └── @common/frontend            # Shareable stub React component library.

### Features

#### Common setup

- Monorepo using Turborepo
- Testing with [Jest](https://jestjs.io/) & [Playwright](https://playwright.dev/)
- Code linting with [ESLint](https://eslint.org/)
- Code formatting with [Prettier](https://prettier.io)
- Sentry logging integration (toggle via .env)

#### API

- Built with NestJS
- Deployed with Docker, GitHub Actions, and Azure Container Apps
- PostgreSQL database with Drizzle ORM
- API documentation via OpenAPI and Swagger

### Useful Commands

#### Install dependencies

```bash
pnpm install
```

#### Build

```bash
# Will build all the app & packages with the supported `build` script.
pnpm build

# ℹ️ If you plan to only build apps individually,
# Please make sure you've built the packages first.
```

#### Develop

```bash
# Will run the development server for all the app & packages with the supported `dev` script.
pnpm dev
```

#### test

```bash
# Will launch a test suites for all the app & packages with the supported `test` script.
pnpm test

# You can launch e2e testes with `test:e2e`
pnpm test:e2e

# See `@common/jest-config` to customize the behavior.
```

#### Lint

```bash
# Will lint all the app & packages with the supported `lint` script.
# See `@common/eslint-config` to customize the behavior.
pnpm lint
```

#### Format

```bash
# Will format all the supported `.ts,.js,json,.tsx,.jsx` files.
# See `@common/eslint-config/prettier-base.js` to customize the behavior.
pnpm format
```

### Useful tips

#### pnpm collisions

```bash
# when running the Dockerfile
 docker build -f apps/api/Dockerfile .

# `pnpm install` does not progress
 [build 4/6] RUN pnpm --filter=api... install --frozen-lockfile


# Solution

 # Ensure pnpm version matches Dockerfile
 pnpm --version

 # if it does not match, update the pnpm version in `package.json`, and run
 pnpm install

 # this should recreate the pnpm-lock.yaml file, then rerun the docker build command
```

#### making a small docker image

```bash

du -h -d 1 | sort -hr

# du: This command estimates the disk space used by files and directories.
# -h: This option formats the output in a human-readable format (e.g., KB, MB, GB).
# -d 1: This option specifies the depth of the directory listing, in this case, only listing the immediate subdirectories (level 1).
# |: This pipe symbol redirects the output of the du command to the next command.
# sort: This command sorts the input, in this case, the output of the du command.
# -hr: This option sorts numerically (the -r option sorts in reverse order, so largest to smallest).

```

### Todo

Dockerise

- [x] fix pnpm issues / update pnpm / update node 23.10.0
- [x] get Dockerfile to run
- [ ] make docker container as small as possible (currently ~747MB)
- [ ] dockerise frontend

API deployment

- [x] docker container to Google Artifact Registry
- [x] GAR -> google cloud run deploy (https://cloud.google.com/blog/products/devops-sre/deploy-to-cloud-run-with-github-actions/)
- [ ] why does github actions upload 3 containers?
- [ ] add startup probe (https://knative.dev/docs/serving/services/configure-probing/#configuring-custom-probes)\
- [ ] ensure public traffic on deploy

Frontend deployment

- [ ] frontend to Vercel

Other

- [ ] Sentry logging integration (toggle via .env)
- [ ] Update TS config
- [ ] Auth/Security
- [ ] PostgreSQL database with Drizzle ORM
