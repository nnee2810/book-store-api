import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common"
import { Order, Prisma } from "@prisma/client"
import { Cache } from "cache-manager"
import { PaginationResult } from "src/interfaces/pagination-result.interface"
import { PrismaService } from "../prisma/prisma.service"
import { CreateOrderDto } from "./dto/create-order.dto"
import { GetOrdersDto } from "./dto/get-order.dto"
import { UpdateOrderDto } from "./dto/update-order.dto"

@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(userId: string, { type, items }: CreateOrderDto) {
    const products = await this.prismaService.product.findMany({
      where: {
        id: { in: items.map((item) => item.productId) },
      },
    })
    const productsWithQuantity = products.map((product) => ({
      ...product,
      quantity: items.find((item) => item.productId === product.id).quantity,
    }))
    const totalPrice = productsWithQuantity.reduce(
      (total, curent) => (total += curent.price * curent.quantity),
      0,
    )

    return this.prismaService.order.create({
      data: {
        userId,
        type,
        totalPrice,
        products: {
          create: productsWithQuantity.map((product) => ({
            productId: product.id,
            price: product.price,
            quantity: product.quantity,
          })),
        },
      },
    })
  }

  async findAll({
    skip,
    take,
    ...query
  }: GetOrdersDto): Promise<PaginationResult<Order>> {
    const where: Prisma.OrderWhereInput = {
      ...query,
    }
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where,
        skip,
        take,
      }),
      this.prismaService.order.count({ where }),
    ])
    return {
      data,
      total,
      skip,
      take,
    }
  }

  findById(id: string) {
    return this.prismaService.order.findUnique({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    })
  }

  async updateById(id: string, data: UpdateOrderDto) {
    const order = await this.prismaService.order.update({
      where: { id },
      data,
    })
    this.cacheManager.del(`/orders/${order.id}`)
    return order
  }

  async deleteById(id: string) {
    const order = await this.prismaService.order.delete({ where: { id } })
    this.cacheManager.del(`/orders/${order.id}`)
    return order
  }
}
