import { DynamicModule, Module } from "@nestjs/common"
import { ClientsModule } from "@nestjs/microservices"
import { RmqService } from "./rmq.service"

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(name: string): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            imports: [RmqModule],
            inject: [RmqService],
            useFactory: (rmqService: RmqService) => rmqService.getOptions(name),
          },
        ]),
      ],

      exports: [ClientsModule],
    }
  }
}
