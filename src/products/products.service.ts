import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InventoryDto } from "./dto/inventory.dto";
import { ProductGateway } from "./product.gateway";
import { PrismaService } from "src/prisma/prisma.service";
import { QueryProductsDto } from "./dto/query-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";

@Injectable()
export class ProductService {

  constructor(
    private prisma: PrismaService, 
    private gateway: ProductGateway,
  ){}
   
  async getAllProducts(queryDto: QueryProductsDto) {
    const { page = 1, limit = 10, category, minPrice, maxPrice, search } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) {
      where.category = {
        name: category
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.product.count({ where })
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async searchProducts(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ]
      },
      include: { category: true },
      take: 20
    });
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({ 
      where: { id },
      include: { 
        category: true,
        Review: {
          include: {
            user: {
              select: {
                email: true,
                Profile: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async addProduct(productDto: any) {
    // Check if product with same SKU already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { sku: productDto.sku }
    });

    if (existingProduct) {
      throw new BadRequestException(`Product with SKU '${productDto.sku}' already exists`);
    }

    const newProduct = {
      id: Math.random().toString(36).substring(2, 15),
      name: productDto.name,
      description: productDto.description,
      price: productDto.price,
      categoryId: productDto.categoryId,
      quantity: productDto.quantity,
      sku: productDto.sku,
      imageUrl: productDto.imageUrl
    };
    return this.prisma.product.create({ 
      data: newProduct,
      include: { category: true }
    });
  }

  async updateProduct(id: string, updateDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.update({
      where: { id },
      data: updateDto,
      include: { category: true }
    });
  }

  async updateStock(id: string, stockDto: UpdateStockDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    let newQuantity: number;
    
    if (stockDto.operation === 'add') {
      newQuantity = product.quantity + stockDto.quantity;
    } else {
      newQuantity = product.quantity - stockDto.quantity;
      if (newQuantity < 0) {
        throw new BadRequestException('Insufficient stock quantity');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { quantity: newQuantity },
      include: { category: true }
    });

    this.gateway.server.emit('productUpdated', { 
      id, 
      newQuantity, 
      change: stockDto.operation === 'add' ? stockDto.quantity : -stockDto.quantity 
    });

    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({ where: { id } });
    
    return { message: 'Product deleted successfully' };
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