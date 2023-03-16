import { Module } from "@nestjs/common"
import { RmqModule } from "../rmq/rmq.module"
import { ProductsController } from "./products.controller"
import { ProductsService } from "./products.service"

@Module({
  imports: [RmqModule.register("SEARCH_SERVICE")],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
