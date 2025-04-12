import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { LinksModule } from "./links/links.module"
import { LoggerModule } from "nestjs-pino"
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { APP_FILTER } from "@nestjs/core"

import path from "node:path"

@Module({
  imports: [
    SentryModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        name: "template-api",
        autoLogging: false,
        transport: {
          targets: [
            {
              target: "pino-pretty",
              options: { colorize: true },
              level: "debug",
            },
            {
              target: path.resolve(__dirname, "logger/sentry-transport"),
              level: "error",
            },
          ],
        },
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    LinksModule,
  ],
  controllers: [AppController],
  providers: [
    // report any unhandled errors that aren't caught by other error filters to Sentry.
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    AppService,
  ],
})
export class AppModule {}
