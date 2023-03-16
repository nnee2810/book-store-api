import { ApiProperty } from "@nestjs/swagger"
import { UserGender, UserRole } from "@prisma/client"
import { IsEnum, IsNumber, IsString, Min } from "class-validator"

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNumber()
  @Min(18)
  age: number

  @ApiProperty({
    enum: UserGender,
  })
  @IsEnum(UserGender)
  gender: UserGender

  @ApiProperty()
  @IsString()
  phone: string

  @ApiProperty()
  @IsString()
  address: string

  @ApiProperty()
  @IsNumber()
  @Min(0)
  salary: number

  @ApiProperty()
  @IsString()
  username: string

  @ApiProperty()
  @IsString()
  password: string

  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole
}
