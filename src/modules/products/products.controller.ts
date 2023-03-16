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
import { CreateProductDto } from "./dto/create-product.dto"
import { GetProductsDto } from "./dto/get-products.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { ProductsService } from "./products.service"

@ApiTags("products")
@ApiBearerAuth()
@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  createProduct(@Body() data: CreateProductDto) {
    return this.productsService.create(data)
  }

  @Get()
  getAllProducts(@Query() query: GetProductsDto) {
    return this.productsService.findAll(query)
  }

  @Get(":id")
  async getProduct(@Param("id") id: string) {
    const product = await this.productsService.findById(id)
    if (!product) throw new NotFoundException()
    return product
  }

  @Patch(":id")
  async updateProduct(@Param("id") id: string, @Body() data: UpdateProductDto) {
    const product = await this.productsService.findById(id)
    if (!product) throw new NotFoundException()
    return this.productsService.updateById(id, data)
  }

  @Delete(":id")
  async deleteProduct(@Param("id") id: string) {
    const product = await this.productsService.findById(id)
    if (!product) throw new NotFoundException()
    return this.productsService.deleteById(id)
  }
}
