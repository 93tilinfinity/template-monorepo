import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { LinksModule } from "./links/links.module"
import { LoggerModule } from "nestjs-pino"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        name: "api",
        level: process.env["NODE_ENV"] !== "production" ? "debug" : "info",
        transport: process.env["NODE_ENV"] !== "production" ? { target: "pino-pretty" } : undefined,
        autoLogging: false,
        // redact: # https://github.com/pinojs/pino-http?tab=readme-ov-file#pinohttpopts-stream
        // hooks: {} # Hook functions must be synchronous functions
      },
    }),
    LinksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
