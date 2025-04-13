import build from "pino-abstract-transport"
import * as Sentry from "@sentry/node"
import { Transform } from "node:stream"
import { LogEvent } from "./log-event"
import { startSentryClient } from "src/instrument"

const pinoToSentryLevelMap: Record<number, Sentry.SeverityLevel> = {
  60: "fatal",
  50: "error",
  40: "warning",
  30: "log",
  20: "info",
  10: "debug",
}

function getSentryLevel(pinoLevel: number): Sentry.SeverityLevel {
  return pinoToSentryLevelMap[pinoLevel] ?? "error"
}

function extractError(log: LogEvent): Error | undefined {
  if (log.err instanceof Error) {
    return log.err
  }
  if (typeof log.err === "object" && log.err?.message) {
    const e = new Error(log.err.message)
    e.stack = log.err.stack
    return e
  }
  if (log.stack) {
    const e = new Error(log.msg)
    e.stack = log.stack
    return e
  }
  return undefined
}

export default async function () {
  // "The transport code will be executed in a separate worker thread." - https://getpino.io/#/docs/transports
  // init Sentry in separate worker if not already.

  if (!Sentry.getClient()) {
    startSentryClient()
  }

  return build(
    async (source: Transform & build.OnUnknown & { errorKey?: string; messageKey?: string }) => {
      for await (const log of source) {
        if (!log) {
          return
        }
        if (log.level >= 50) {
          const { msg, level, ...extra } = log
          const sentryLevel = getSentryLevel(log.level)
          const error = extractError(log)

          if (error) {
            Sentry.captureException(error, {
              level: sentryLevel,
              fingerprint: msg,
              extra,
            })
          } else {
            Sentry.captureMessage(log.msg, {
              level: sentryLevel,
              fingerprint: msg,
              extra,
            })
          }
        }
      }
    },
  )
}
