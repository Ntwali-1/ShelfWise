import { Body, Get, Post, Patch, Put, Delete, UseGuards, Query, Param } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { ProductService } from "./products.service";
import { ProductDto } from "./dto/add-product.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/rbac/role.decorator";
import { Role } from "src/rbac/role.enum";
import { RolesGuard } from "src/rbac/role.guard";
import { AuthGuard } from "@nestjs/passport";
import { QueryProductsDto } from "./dto/query-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";

import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductController {

  constructor(private readonly productService: ProductService) { }

  @Get()
  async getAllProducts(@Query() queryDto: QueryProductsDto) {
    return this.productService.getAllProducts(queryDto);
  }

  @Get('search')
  async searchProducts(@Query('q') query: string) {
    return this.productService.searchProducts(query);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Post()
  async addProduct(@Body() productDto: ProductDto) {
    return this.productService.addProduct(productDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateDto: UpdateProductDto) {
    return this.productService.updateProduct(id, updateDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Patch(':id/stock')
  async updateStock(@Param('id') id: string, @Body() stockDto: UpdateStockDto) {
    return this.productService.updateStock(id, stockDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
