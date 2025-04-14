import { isMainThread, threadId } from "node:worker_threads"
import * as Sentry from "@sentry/nestjs"
import * as dotenv from "dotenv"

// Note this is not a Nest way to load env vars and
// the rest of the app will use the Config Module.
// However, the principle is to ensure all errors are captured. Hence,
// it is better to init Sentry as the very first step in main.ts, than to
// wait until all Nest modules are initialised (after the app is created).
dotenv.config()

export const startSentryClient = () => {
  Sentry.init({
    // biome-ignore lint/complexity/useLiteralKeys: needed for process.env
    dsn: process.env["SENTRY_DSN"],
    // biome-ignore lint/complexity/useLiteralKeys: needed for process.env
    environment: process.env["NODE_ENV"],
    tracesSampleRate: 1.0,
    debug: false,
  })
  const isSentryInitialised = Sentry.getClient() !== undefined
  console.log({ pid: process.pid, threadId, isMainThread, isSentryInitialised })
}

startSentryClient()
