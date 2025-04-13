export type LogEvent = {
  msg: string
  level: 10 | 20 | 30 | 40 | 50 | 60
  time: number
  name: string
  context: string
  stack?: string
  err?: {
    type: "string" // The name of the object's constructor.
    message: "string" // The supplied error message.
    stack: "string" // The stack when the error was generated.
    raw: Error // Non-enumerable, i.e. will not be in the output, original
    // Error object. This is available for subsequent serializers
    // to use.
    [key: string]: unknown
  }
  [key: PropertyKey]: unknown
}
