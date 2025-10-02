import { Injectable } from "@nestjs/common";
import { InventoryDto } from "./dto/inventory.dto";
import { ProductGateway } from "./product.gateway";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService {

  constructor(
    private prisma: PrismaService, 
    private gateway: ProductGateway,
  ){}
   
  async getAllProducts() {
    return this.prisma.product.findMany();
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async addProduct(productDto: any) {
    const newProduct = {
      id: Math.random().toString(36).substring(2, 15),
      name: productDto.name,
      description: productDto.description,
      price: productDto.price,
      category: productDto.category,
      quantity: productDto.quantity,
      sku: productDto.sku,
      imageUrl: productDto.imageUrl
    };
    return this.prisma.product.create({ data: newProduct });
  }

  /*async reduceProductQuantity(id: string, inventoryDto: any) {
    const product = await this.prisma.product.findUnique({ where: { id } }); 

    if (!product) {
      throw new Error('Product not found');
    }
    const newQuantity = product.quantity - inventoryDto.quantity;
    const change = inventoryDto.quantity;

    if (newQuantity < 0) {
      throw new Error('Insufficient product quantity');
    }else if (newQuantity === 0) {
      return { message: 'Product quantity reduced to zero' };
    }else{
      const updatedProduct = this.prisma.product.update({
        where: { id },
        data: { quantity: newQuantity }
      });

      this.gateway.server.emit('productUpdated', { id, newQuantity, change} );

      return updatedProduct;
    }


  }

  async increaseProductQuantity(id: string, inventoryDto: InventoryDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error('Product not found');
    }

    const newQuantity = product.quantity + inventoryDto.quantity;
    const change = inventoryDto.quantity;

    const updatedProduct =  this.prisma.product.update({
      where: { id },
      data: { quantity: newQuantity }
    });

    this.gateway.server.emit('productUpdated', { id, newQuantity, change} );
    return updatedProduct;
  }*/
}