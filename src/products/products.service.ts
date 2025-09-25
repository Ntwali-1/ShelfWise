import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from "@prisma/client";

@Injectable()
export class ProductService {

  constructor(private prisma: PrismaClient) {}
   
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
}