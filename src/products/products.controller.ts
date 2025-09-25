import { Body, Get, Post } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { ProductService } from "./products.service";
import { ProductDto } from "./dto/add-product.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth()
@Controller('products')
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  @Get('all')
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

}