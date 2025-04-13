import "./instrument"

import { NestFactory } from "@nestjs/core"
import { Logger, LoggerErrorInterceptor } from "nestjs-pino"
import { AppModule } from "./app.module"

import fs from "node:fs"

async function bootstrap() {
  // biome-ignore lint/complexity/useLiteralKeys: needed for process.env
  if (process.env["NODE_ENV"] !== "production") {
    if (!fs.existsSync(".env")) {
      console.log(
        "No .env file found! Please create one using the .env.example file as a template.",
      )
      process.exit(1)
    }
    require("dotenv").config({ path: ".env" })
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  app.useLogger(app.get(Logger))
  app.useGlobalInterceptors(new LoggerErrorInterceptor()) // expose stack trace and error class in err property

  // biome-ignore lint/complexity/useLiteralKeys: needed for process.env
  const portNumber = process.env["PORT"] ? Number(process.env["PORT"]) : 3000
  const validPort = Number.isInteger(portNumber) ? portNumber : 3000
  await app.listen(validPort)
}
bootstrap()
