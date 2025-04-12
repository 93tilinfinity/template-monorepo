import * as Sentry from "@sentry/nestjs"

Sentry.init({
  // biome-ignore lint/complexity/useLiteralKeys: needed for process.env
  dsn: process.env["SENTRY_DSN"],
  // biome-ignore lint/complexity/useLiteralKeys: needed for process.env
  environment: process.env["NODE_ENV"],
  tracesSampleRate: 1.0,
  debug: false,
})
