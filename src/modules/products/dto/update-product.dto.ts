import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString, Min } from "class-validator"
import { CreateProductDto } from "./create-product.dto"

export class UpdateProductDto implements Partial<CreateProductDto> {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  author?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  genre?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  publisher?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number
}
