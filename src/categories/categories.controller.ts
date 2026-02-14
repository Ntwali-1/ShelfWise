import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from 'src/rbac/role.decorator';
import { Role } from 'src/rbac/role.enum';
import { RolesGuard } from 'src/rbac/role.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':name/products')
  async getProductsByCategory(@Param('name') name: string) {
    return this.categoriesService.getProductsByCategory(name);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('clerk'), RolesGuard)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('clerk'), RolesGuard)
  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}

