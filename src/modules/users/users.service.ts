import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common"
import { BadRequestException } from "@nestjs/common/exceptions"
import { ClientProxy } from "@nestjs/microservices"
import { Prisma, User } from "@prisma/client"
import { Cache } from "cache-manager"
import { handleErrorException } from "src/helpers/handleErrorException"
import { UserDocument } from "src/interfaces/documents/user-document.interface"
import { PaginationResult } from "src/interfaces/pagination-result.interface"
import { PostgresErrorCode } from "src/interfaces/postgres-error-code.interface"
import { exclude } from "src/utils/exclude"
import { PrismaService } from "../prisma/prisma.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { GetUsersDto } from "./dto/get-users.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    @Inject("SEARCH_SERVICE")
    private searchService: ClientProxy,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({ data })
      await this.searchService
        .send<any, UserDocument>("create-user-index", {
          id: user.id,
          name: user.name,
        })
        .toPromise()
      return user
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation)
        throw new BadRequestException("Tên đăng nhập đã được sử dụng")
      handleErrorException(error)
    }
  }

  async findAll({
    skip,
    take,
    ...query
  }: GetUsersDto): Promise<PaginationResult<Omit<User, "password">>> {
    let ids: string[]
    if (query.name)
      ids = (
        await this.searchService
          .send<UserDocument[], string>("search-user", query.name)
          .toPromise()
      ).map((item) => item.id)

    const where: Prisma.UserWhereInput = {
      id: {
        in: ids,
      },
    }

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take,
      }),
      this.prismaService.user.count({ where }),
    ])
    return {
      data: data.map((user) => exclude(user, ["password"])),
      total,
      skip,
      take,
    }
  }

  findById(id: string) {
    return this.prismaService.user.findUnique({ where: { id } })
  }

  async updateById(id: string, data: UpdateUserDto) {
    try {
      const user = await this.prismaService.user.update({ where: { id }, data })
      this.cacheManager.del(`/users/${user.id}`)
      await this.searchService
        .send<any, UserDocument>("update-user-index", {
          id: user.id,
          name: user.name,
        })
        .toPromise()
      return user
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation)
        throw new BadRequestException("Tên đăng nhập đã được sử dụng")
    }
  }

  async deleteById(id: string) {
    const user = await this.prismaService.user.delete({ where: { id } })
    this.cacheManager.del(`/users/${user.id}`)
    await this.searchService
      .send<any, string>("delete-user-index", user.id)
      .toPromise()
    return user
  }
}
