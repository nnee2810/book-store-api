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
import { UserRole } from "@prisma/client"
import { exclude } from "src/utils/exclude"
import { Roles } from "../../decorators/roles.decorator"
import { CreateUserDto } from "./dto/create-user.dto"
import { GetUsersDto } from "./dto/get-users.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { UsersService } from "./users.service"
@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
@Roles([UserRole.ADMIN])
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    return exclude(await this.usersService.create(data), ["password"])
  }

  @Get()
  getAllUsers(@Query() query: GetUsersDto) {
    return this.usersService.findAll(query)
  }

  @Get(":id")
  async getUser(@Param("id") id: string) {
    const user = await this.usersService.findById(id)
    if (!user) throw new NotFoundException()
    return exclude(user, ["password"])
  }

  @Patch(":id")
  async updateUser(@Param("id") id: string, @Body() data: UpdateUserDto) {
    const user = await this.usersService.findById(id)
    if (!user) throw new NotFoundException()
    return exclude(await this.usersService.updateById(id, data), ["password"])
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: string) {
    const user = await this.usersService.findById(id)
    if (!user) throw new NotFoundException()
    return exclude(await this.usersService.deleteById(id), ["password"])
  }
}
