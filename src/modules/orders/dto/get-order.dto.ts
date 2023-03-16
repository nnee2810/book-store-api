import { ApiProperty } from "@nestjs/swagger"
import { OrderStatus, OrderType } from "@prisma/client"
import { IsEnum, IsOptional } from "class-validator"
import { PaginationDto } from "src/dto/pagination.dto"

export class GetOrdersDto extends PaginationDto {
  @ApiProperty({
    enum: OrderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus

  @ApiProperty({
    enum: OrderType,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderType)
  type?: OrderType
}
