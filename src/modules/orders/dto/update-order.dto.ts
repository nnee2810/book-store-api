import { ApiProperty } from "@nestjs/swagger"
import { OrderStatus } from "@prisma/client"
import { IsEnum, IsOptional } from "class-validator"

export class UpdateOrderDto {
  @ApiProperty({
    enum: OrderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus
}
