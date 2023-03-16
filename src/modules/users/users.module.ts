import { Module } from "@nestjs/common"
import { RmqModule } from "../rmq/rmq.module"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"

@Module({
  imports: [RmqModule.register("SEARCH_SERVICE")],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
