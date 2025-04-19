import "./instrument"

import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { Logger, LoggerErrorInterceptor } from "nestjs-pino"
import { AppModule } from "./app.module"
import helmet from "helmet"
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

  app.use(helmet())

  const allowListCors = [
    // prod
    "https://template-monorepo-frontend.vercel.app/",

    // preview
    /^https:\/\/(template-monorepo-frontend)-[0-9a-z-]+-93tilinfinity\.vercel\.app$/,
  ]
  // biome-ignore lint/complexity/useLiteralKeys: needed for process.env
  if (process.env["NODE_ENV"] !== "production") {
    allowListCors.push("http://localhost:3040")
  }
  app.enableCors({ origin: allowListCors })

  const config = new DocumentBuilder()
    .setTitle("Template API")
    .setDescription("The API description")
    .setVersion("1.0")
    .addTag("api")
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, documentFactory, { jsonDocumentUrl: "docs/json" })

  // biome-ignore lint/complexity/useLiteralKeys: needed for process.env
  const portNumber = process.env["PORT"] ? Number(process.env["PORT"]) : 3000
  const validPort = Number.isInteger(portNumber) ? portNumber : 3000
  await app.listen(validPort)
}
bootstrap()
