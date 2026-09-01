import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryFeeDto } from './dto/update-category-fee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private categories: CategoriesService) {}

  @Get()
  async findAll() {
    return this.categories.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categories.findOne(id);
  }

  @Get(':id/fee')
  async getFee(@Param('id') id: string) {
    return this.categories.getFee(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id/fee')
  async updateFee(@Param('id') id: string, @Body() dto: UpdateCategoryFeeDto) {
    return this.categories.updateFee(id, dto);
  }
}