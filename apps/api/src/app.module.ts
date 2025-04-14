import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { SentryGlobalFilter } from "@sentry/nestjs/setup"
import { LoggerModule } from "nestjs-pino"
import { LinksModule } from "./links/links.module"

import { APP_FILTER } from "@nestjs/core"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

import path from "node:path"

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        name: "template-api",
        autoLogging: false,
        transport: {
          targets: [
            {
              target: "pino-pretty",
              options: { colorize: true, singleLine: true },
              level: "debug",
            },
            {
              target: path.resolve(__dirname, "logger/sentry-transport"),
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
