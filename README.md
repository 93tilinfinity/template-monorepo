# A monorepo boilerplate

This monorepo includes the following packages/apps:

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

This `Turborepo` has some additional tools already setup.

#### API

- Nest JS
- Deployment using GitHub Actions + Docker & Azure container apps
- PostgresSQL database using drizzle ORM
- OpenAPI specification with Swagger

#### Common to all apps

- tests with [Jest](https://jestjs.io/) & [Playwright](https://playwright.dev/)
- code linting with [ESLint](https://eslint.org/)
- code formatting with [Prettier](https://prettier.io)
- logging with inbuilt Sentry transport (using .env variable)

### Useful Commands

#### Build

```bash
# Will build all the app & packages with the supported `build` script.
pnpm run build

# ℹ️ If you plan to only build apps individually,
# Please make sure you've built the packages first.
```

#### Develop

```bash
# Will run the development server for all the app & packages with the supported `dev` script.
pnpm run dev
```

#### test

```bash
# Will launch a test suites for all the app & packages with the supported `test` script.
pnpm run test

# You can launch e2e testes with `test:e2e`
pnpm run test:e2e

# See `@common/jest-config` to customize the behavior.
```

#### Lint

```bash
# Will lint all the app & packages with the supported `lint` script.
# See `@common/eslint-config` to customize the behavior.
pnpm run lint
```

#### Format

```bash
# Will format all the supported `.ts,.js,json,.tsx,.jsx` files.
# See `@common/eslint-config/prettier-base.js` to customize the behavior.
pnpm format
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```bash
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```bash
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
