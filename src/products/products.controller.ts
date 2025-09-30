import { Body, Get, Post, Patch, UseGuards } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { ProductService } from "./products.service";
import { ProductDto } from "./dto/add-product.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { InventoryDto } from "./dto/inventory.dto";
import { Roles } from "src/rbac/role.decorator";
import { Role } from "src/rbac/role.enum";
import { RolesGuard } from "src/rbac/role.guard";
import { AuthGuard } from "@nestjs/passport";


@ApiBearerAuth()
@Controller('products')
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  @Get('all')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Body('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Post('add')
  async addProduct(@Body() productDto: ProductDto) {
    return this.productService.addProduct(productDto);
  }

  @Patch(':id/inventory/reduce')
  async reduceProductQuantity(@Body('id') id: string, @Body() inventoryDto: InventoryDto) {
    return this.productService.reduceProductQuantity(id, inventoryDto);
  }

  @Patch(':id/inventory/increase')
  async increaseProductQuantity(@Body('id') id: string, @Body() inventoryDto: InventoryDto) {
    return this.productService.increaseProductQuantity(id, inventoryDto);
  }

}