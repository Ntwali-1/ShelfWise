import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from "@prisma/client";
import { InventoryDto } from "./dto/inventory.dto";
import { ProductGateway } from "./product.gateway";

@Injectable()
export class ProductService {

  constructor(
    private prisma: PrismaClient, 
    private gateway: ProductGateway
  ){}
   
  async getAllProducts() {
    return this.prisma.product.findMany();
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async addProduct(productDto: any) {
    const newProduct = {
      id: uuidv4(),
      ...productDto
    };
    return this.prisma.product.create({ data: newProduct });
  }

  async reduceProductQuantity(id: string, inventoryDto: any) {
    const product = await this.prisma.product.findUnique({ where: { id } }); 

    if (!product) {
      throw new Error('Product not found');
    }
    const newQuantity = product.quantity - inventoryDto.quantity;

    if (newQuantity < 0) {
      throw new Error('Insufficient product quantity');
    }else if (newQuantity === 0) {
      return { message: 'Product quantity reduced to zero' };
    }else{
      return this.prisma.product.update({
        where: { id },
        data: { quantity: newQuantity }
      });

      const notify = this.gateway.server.emit('productUpdated', { id, newQuantity } );
    }


  }

  async increaseProductQuantity(id: string, inventoryDto: InventoryDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error('Product not found');
    }
    const newQuantity = product.quantity + inventoryDto.quantity;
    return this.prisma.product.update({
      where: { id },
      data: { quantity: newQuantity }
    });
  }
}