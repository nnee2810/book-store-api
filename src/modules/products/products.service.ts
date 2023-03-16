import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common"
import { ClientProxy } from "@nestjs/microservices"
import { Prisma, Product } from "@prisma/client"
import { Cache } from "cache-manager"
import { ProductDocument } from "src/interfaces/documents/product-document.interface"
import { PaginationResult } from "src/interfaces/pagination-result.interface"
import { PrismaService } from "../prisma/prisma.service"
import { CreateProductDto } from "./dto/create-product.dto"
import { GetProductsDto } from "./dto/get-products.dto"
import { UpdateProductDto } from "./dto/update-product.dto"

@Injectable()
export class ProductsService {
  constructor(
    private prismaService: PrismaService,
    @Inject("SEARCH_SERVICE")
    private searchService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(data: CreateProductDto) {
    const product = await this.prismaService.product.create({
      data,
    })
    await this.searchService
      .send<any, ProductDocument>("create-product-index", {
        id: product.id,
        name: product.name,
      })
      .toPromise()
    return product
  }

  async findAll({
    skip,
    take,
    ...query
  }: GetProductsDto): Promise<PaginationResult<Product>> {
    let ids: string[]
    if (query.name)
      ids = (
        await this.searchService
          .send<ProductDocument[], string>("search-product", query.name)
          .toPromise()
      ).map((item) => item.id)

    const where: Prisma.ProductWhereInput = {
      id: {
        in: ids,
      },
    }
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        where,
        orderBy: {
          updatedAt: "desc",
        },
        skip,
        take,
      }),
      this.prismaService.product.count({ where }),
    ])
    return {
      data,
      total,
      skip,
      take,
    }
  }

  findById(id: string) {
    return this.prismaService.product.findUnique({
      where: { id },
    })
  }

  async updateById(id: string, data: UpdateProductDto) {
    const product = await this.prismaService.product.update({
      where: { id },
      data,
    })
    this.cacheManager.del(`/products/${product.id}`)
    await this.searchService
      .send<any, ProductDocument>("update-product-index", {
        id: product.id,
        name: product.name,
      })
      .toPromise()

    return product
  }

  async deleteById(id: string) {
    const product = await this.prismaService.product.delete({
      where: { id },
    })
    this.cacheManager.del(`/products/${product.id}`)
    await this.searchService
      .send<any, string>("delete-product-index", product.id)
      .toPromise()
    return product
  }
}
