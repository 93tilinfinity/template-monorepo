# 🚀 Startup boilerplate

A monorepo boilerplate using Turborepo, designed to help you ship full-stack applications fast.

Includes a NestJS API, a Next.js frontend, and a suite of shared packages for scalable development.

### Apps and Packages

    .
    ├── apps
    │   ├── api                         # NestJS app (https://nestjs.com).
    │   └── frontend                    # Next.js app (https://nextjs.org).
    └── packages
        ├── api                         # Shared backend resources
        ├── jest-config                 # `jest` configurations
        ├── typescript-config           # `tsconfig.json`s used throughout the monorepo
        └── frontend                    # Shareable stub React component library.

### Features

#### Common setup

- Monorepo using Turborepo
- Testing with [Jest](https://jestjs.io/) & [Playwright](https://playwright.dev/)
- Code linting/formatting with [Biome](https://biomejs.dev/)
- Sentry logging integration (toggle via .env)

#### API

- Built with NestJS
- Deployed with Docker, GitHub Actions, and Azure Container Apps
- PostgreSQL database with Drizzle ORM (coming soon)
- API documentation via OpenAPI and Swagger (coming soon)

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

#### Lint & Format

```bash
# Will lint and format all the app & packages.
# See `biome.jsonc` to customise the behavior.
turbo format-lint
```

```bash
# auto apply fixes
turbo format-lint:fix
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

### Deployment

#### General principles

- Keep as much configuration as code to minimise platform-specific dependencies (Vercel, GCP, GitHub).
- Only deploy what has changed.
- For every PR, run linting, formatting, and builds with mandatory status checks before merging.
- On merge to main, build and push Docker images with versioned tags (not 'latest') to the container registry.
- Try to roll forward with quick fixes rather than rollbacks when issues arise.

#### Pipeline

1. Run all unit/integration tests
2. Build + push + deploy API
3. Build + deploy frontend to Vercel
4. Run e2e tests

Rollback on any failure.

Ideally, we'd release both apps to a staging environment or a production environment without traffic first and once e2e tests pass we'd promote both apps to their public domains. However, for simplicity this is a single environment world and I accept the risk that a broken deployment might bring down the live app until rollback.

#### Setup

API deployment using Google Cloud Run (apparently good for cost efficiency) needs some setup steps in GCP. Working on reducing these steps as much as possible.

1. Create new project `template` (obv create an account and setup billing if you havent already)
2. Create an artifact registry `gcr-template`
3. Deploy to the artifact registry
4. Create a`'Workload Identity Pool` to allow github to authenticate to your Google Cloud Account
   1. Then create a `provider` for github
   2. add an attribute mapping
   3. add repository_id as attribute condition, you'll be able to find this integer id on GitHub (you can right click on your repo, 'Inspect source' and seach for `repository` to find it)
5. Create a IAM service account
   1. grant `roles/iam.workloadIdentityUser`
   2. grant `Artifact reader/writer`
   3. grant `Cloud Run Admin` (cloud run)
   4. grant `Service Account User` (cloud run)
6. Enable `Compute Engine API`
7. **Add `Workload Identity Provider` and `Service Account` email to GitHub repository secrets as `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` respectively.**

The github workflow should now be able to setup the container app and deploy on merge with main.

### Todo

#### CI/CD

API deployment (a single 'production' environment)

- [x] fix pnpm issues / update pnpm / update node 23.10.0
- [x] get Dockerfile to run
- [x] docker container to Google Artifact Registry
- [x] GAR -> google cloud run deploy
- [x] add startup probe

Frontend deployment

- [x] frontend to Vercel

Cleanup

- [ ] why does github actions upload 3 containers?
- [ ] ensure public traffic on deploy
- [ ] add a custom domain
- [ ] make api docker container as small as possible (currently ~747MB)
- [ ] Add Vulnerability scanning on upload to Artifact store

#### Other

- [x] Update TS config
- [x] replace eslint and prettier with Biome
- [x] run Biome in CI
- [ ] setup a common sentry logger (toggle via .env)
- [ ] connect frontend with api + auth
- [ ] get tests working/cleanup jest config
- [ ] add a database (PostgreSQL with Drizzle ORM)
- [ ] auto API documentation via OpenAPI and Swagger

### Useful Links

- https://github.com/google-github-actions/example-workflows/tree/main/workflows/create-cloud-deploy-release
- https://cloud.google.com/blog/products/devops-sre/deploy-to-cloud-run-with-github-actions/
- https://knative.dev/docs/serving/services/configure-probing/#configuring-custom-probes
