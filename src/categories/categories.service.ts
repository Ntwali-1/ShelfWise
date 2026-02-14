import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { Product: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async getProductsByCategory(categoryName: string) {
    const category = await this.prisma.category.findUnique({
      where: { name: categoryName },
      include: {
        Product: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!category) {
      throw new NotFoundException(`Category '${categoryName}' not found`);
    }

    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name }
    });

    if (existing) {
      throw new ConflictException('Category already exists');
    }

    return this.prisma.category.create({
      data: createCategoryDto
    });
  }

  async deleteCategory(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { Product: true } } }
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.Product > 0) {
      throw new ConflictException('Cannot delete category with existing products');
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}

