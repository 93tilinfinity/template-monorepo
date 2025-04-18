import { Injectable, Logger } from "@nestjs/common"

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)

  getHello(): string {
    this.logger.error("a string error thrown")
    return "Hello World!"
  }
}
