import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { RmqOptions, Transport } from "@nestjs/microservices"
import { EnvPayload } from "src/interfaces/env-payload.interface"

@Injectable()
export class RmqService {
  constructor(private configService: ConfigService<EnvPayload>) {}

  getOptions(queue: string): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>("RMQ_URL")],
        queue,
        persistent: true,
      },
    }
  }
}
