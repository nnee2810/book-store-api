import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { User } from "@prisma/client"
import { CurrentUser } from "src/decorators/current-user.decorator"
import { handleErrorException } from "src/helpers/handleErrorException"
import { CreateOrderDto } from "./dto/create-order.dto"
import { GetOrdersDto } from "./dto/get-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"
import { OrdersService } from "./orders.service"

@ApiTags("orders")
@ApiBearerAuth()
@Controller("orders")
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() data: CreateOrderDto, @CurrentUser() user: User) {
    try {
      return this.ordersService.create(user.id, data)
    } catch (error) {
      handleErrorException(error)
    }
  }

  @Get()
  getAllOrders(@Query() query: GetOrdersDto) {
    try {
      return this.ordersService.findAll(query)
    } catch (error) {
      handleErrorException(error)
    }
  }

  @Get(":id")
  async getOrder(@Param("id") id: string) {
    try {
      const order = await this.ordersService.findById(id)
      if (!order) throw new NotFoundException()
      return order
    } catch (error) {
      handleErrorException(error)
    }
  }

  @Patch(":id")
  async updateOrder(@Param("id") id: string, @Body() data: UpdateOrderDto) {
    try {
      const order = await this.ordersService.findById(id)
      if (!order) throw new NotFoundException()
      return this.ordersService.updateById(id, data)
    } catch (error) {
      handleErrorException(error)
    }
  }

  @Delete(":id")
  async deleteOrder(@Param("id") id: string) {
    try {
      const order = await this.ordersService.findById(id)
      if (!order) throw new NotFoundException()
      return this.ordersService.deleteById(id)
    } catch (error) {
      handleErrorException(error)
    }
  }
}
