import build from "pino-abstract-transport"
import { captureException, captureMessage, SeverityLevel } from "@sentry/core"
import { Transform } from "node:stream"

const pinoToSentryLevelMap: Record<number, SeverityLevel> = {
  60: "fatal",
  50: "error",
  40: "warning",
  30: "log",
  20: "info",
  10: "debug",
}

function getSentryLevel(pinoLevel: number): SeverityLevel {
  return pinoToSentryLevelMap[pinoLevel] ?? "error"
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function extractError(log: any): Error | undefined {
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function enrichSentryScope(scope: any, log: any) {
  scope.setLevel(getSentryLevel(log.level))
  scope.setContext("log", log)
  return scope
}

export default async function () {
  return build(
    async (source: Transform & build.OnUnknown & { errorKey?: string; messageKey?: string }) => {
      for await (const log of source) {
        if (!log) {
          return
        }
        if (log.level >= 50) {
          const error = extractError(log)
          if (error) {
            captureException(error, (scope) => enrichSentryScope(scope, log))
          } else {
            captureMessage(log?.[source.messageKey ?? "msg"], (scope) =>
              enrichSentryScope(scope, log),
            )
          }
        }
      }
    },
  )
}
