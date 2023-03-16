import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, Min } from "class-validator"

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  author: string

  @ApiProperty()
  @IsString()
  genre: string

  @ApiProperty()
  @IsString()
  publisher: string

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number
}
