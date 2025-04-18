# 🚀 Fullstack monorepo boilerplate with CI/CD

A NestJS API, a Next.js frontend, and a suite of shared packages in a Turborepo monorepo.

## Apps and Packages

#### Structure

    .
    ├── apps
    │   ├── api                         # NestJS app (https://nestjs.com).
    │   └── frontend                    # Next.js app (https://nextjs.org).
    └── packages
        ├── api                         # Shared backend resources
        ├── jest-config                 # `jest` configurations
        ├── typescript-config           # `tsconfig.json`s used throughout the monorepo
        └── frontend                    # Shareable stub React component library.

#### Development Tooling

- ✅ Linting/formatting config with [Biome](https://biomejs.dev/)
- ✅ Monorepo workspace configurations using pnpm/Turborepo

#### Shared Packages

- ✅ Common utility libraries (ts config, ui, test config, logger)
- ✅ Shared type definitions

#### App Deployment

- ✅ CICD pipeline
- ✅ API deployment with Docker, GitHub Actions, and Azure Container Apps
- ✅ frontend deployment with Vercel
- Environment management templates (✅ backend, ❌ frontend)

#### Quality Assurance

- ✅ End-to-end testing framework with [Jest](https://jestjs.io/) & [Playwright](https://playwright.dev/)
- ❌ Performance testing suite

#### Observability

- Logger using Pino and Sentry (✅ backend, ❌ frontend)

#### Security

- Secret management strategy  (✅ backend, ❌ frontend)
- Dependency vulnerability scanning (✅ backend, ❌ frontend)

#### Data Management

- ❌ PostgreSQL database with Drizzle ORM
- ❌ Database migration scripts

#### Developer Experience

- ✅ Local development IDE config
- ✅ OpenAPI Spec
- ❌ Architecture diagrams

#### Release Management

- ❌ Version control strategy
- ❌ Feature flag infrastructure


## Useful Commands

```bash
pnpm install

# Will build all the app & packages with the supported `build` script.
pnpm build

# ℹ️ If you plan to only build apps individually,
# Please make sure you've built the packages first.

# Will run the development server for all the app & packages with the supported `dev` script.
pnpm dev

# Will launch a test suites for all the app & packages with the supported `test` script.
pnpm test

# You can launch e2e testes with `test:e2e`
# See `@common/jest-config` to customise the behavior.
pnpm test:e2e

# Will lint and format all the app & packages.
# See `biome.jsonc` to customise the behavior.
turbo format-lint

# auto apply fixes
turbo format-lint:fix
```

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

## Deployment

- Should keep as much configuration as code to minimise platform-specific dependencies (Vercel, GCP, GitHub).
- Only deploy what has changed.
- For every PR, should run linting, formatting, and builds with mandatory status checks before merging.
- On merge to main, should build and push Docker images with versioned tags (not 'latest') to the container registry.
- Should try to roll forward with quick fixes rather than rollbacks when issues arise.

### Pipeline

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
   5. grant `roles/secretmanager.secretAccessor` (secrets manager)
6. Enable `Compute Engine API`
7. **Add `Workload Identity Provider` and `Service Account` email to GitHub repository secrets as `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_SERVICE_ACCOUNT` respectively.**
8. Enable Google Secret Manager API + upload API secrets (accessing `latest` version)

The github workflow should now be able to setup the container app and deploy on merge with main.

(todo - frontend setup)

## Logging & Monitoring

- Should be simple i.e. consuming apps should not need to configure much
- Should include structured metadata (JSON-style), not just plain text (better for filtering/searching/parsing)
- Should use log levels for clarity and control
- Should be environment-aware
- Should port easily to third party tools like Sentry
- Should be testable/mocked in unit tests

See individual app READMEs for information on implementation.


## Todo

- [ ] add github sha as version number to env vars and github release
- [ ] add a database (PostgreSQL with Drizzle ORM)

- [ ] add Sentry to frontend unhandled exceptions
- [ ] GCP assets to terraform
- [ ] Vercel assets to terraform

#### API security 

- [ ] add csrf-csrf
- [ ] helmet to sett HTTP headers appropriately
- [ ] add auth module for user endpoints
- [x] add CORS and rate throttling

#### API deployment (a single 'production' environment)

- [x] fix pnpm issues / update pnpm / update node 23.10.0
- [x] get Dockerfile to run
- [x] add a GCP secret vault for API
- [x] docker container to Google Artifact Registry
- [x] add auto vulnerability scanning on upload to container registry
- [x] GAR -> google cloud run deploy
- [x] add startup probe

#### Frontend deployment

- [x] frontend to Vercel

#### Logging

- [x] add pino logger w/ pinoHttp and pino pretty
- [x] unhandled exceptions / app errors to Sentry
- [x] unhandled exceptions / logger.error to Sentry

#### Other

- [x] add Swagger/OpenAPI spec
- [x] Update TS config
- [x] replace eslint and prettier with Biome
- [x] run Biome in CI
- [x] setup a common sentry logger (toggle via .env)

#### Deployment Cleanup

- [x] run lint-format as a check on all pull requests
- [ ] why does github actions upload 3 containers?
- [ ] ensure public traffic on deploy
- [ ] add a custom domain
- [ ] make api docker container as small as possible (currently ~747MB)

## Useful Links

- https://github.com/google-github-actions/example-workflows/tree/main/workflows/create-cloud-deploy-release
- https://cloud.google.com/blog/products/devops-sre/deploy-to-cloud-run-with-github-actions/
- https://knative.dev/docs/serving/services/configure-probing/#configuring-custom-probes
- https://cloud.google.com/sdk/gcloud/reference/run/services/replace (container deployment flags)
- https://cloud.google.com/kubernetes-engine/enterprise/knative-serving/docs/configuring/environment-variables (setting api env vars)
- https://github.com/pinojs/pino (prod) / https://github.com/pinojs/pino-pretty (dev)
- https://docs.nestjs.com/openapi/introduction (openAPI spec)
