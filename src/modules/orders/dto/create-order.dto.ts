import { ApiProperty } from "@nestjs/swagger"
import { OrderType } from "@prisma/client"
import { Type } from "class-transformer"
import {
  IsEnum,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from "class-validator"

export class OrderItem {
  @IsString()
  productId: string

  @IsNumber()
  @Min(1)
  quantity: number
}

export class CreateOrderDto {
  @ApiProperty({
    enum: OrderType,
  })
  @IsEnum(OrderType)
  type: OrderType

  @ApiProperty({
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items: OrderItem[]
}
