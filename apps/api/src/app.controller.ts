import { Controller, Get } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AppService } from "./app.service"
import { Throttle } from "@nestjs/throttler"

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get("/")
  getHello(): string {
    return this.appService.getHello()
  }

  @Get("/debug-sentry")
  getError() {
    throw new Error("My first Sentry error!")
  }

  // Override default config for Rate limiting and duration
  @Throttle({ default: { limit: 3, ttl: 2000 } })
  @Get("version")
  async getGithubSha(): Promise<string | undefined> {
    return await this.configService.get("GITHUB_SHA")
  }
}
