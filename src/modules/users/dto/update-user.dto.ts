import { ApiProperty } from "@nestjs/swagger"
import { UserGender, UserRole } from "@prisma/client"
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { CreateUserDto } from "./create-user.dto"

export class UpdateUserDto implements Partial<CreateUserDto> {
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
  @IsNumber()
  @Min(18)
  age?: number

  @ApiProperty({
    enum: UserGender,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string

  @ApiProperty({
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}
