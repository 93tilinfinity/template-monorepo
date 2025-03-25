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

### Todo

- Dockerise
- Deployment (Azure/Vercel)
- Sentry logging integration (toggle via .env)
- PostgreSQL database with Drizzle ORM
