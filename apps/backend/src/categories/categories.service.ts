import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CategoryFee } from './entities/category-fee.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryFeeDto } from './dto/update-category-fee.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categories: Repository<Category>,
    @InjectRepository(CategoryFee) private fees: Repository<CategoryFee>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categories.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categories.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async getFee(categoryId: string): Promise<CategoryFee> {
    const fee = await this.fees.findOne({ where: { categoryId } });
    if (!fee) {
      throw new NotFoundException('No fee set for this category');
    }
    return fee;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categories.create(dto);
    return this.categories.save(category);
  }

  async updateFee(categoryId: string, dto: UpdateCategoryFeeDto): Promise<CategoryFee> {
    let fee = await this.fees.findOne({ where: { categoryId } });

    if (!fee) {
      fee = this.fees.create({ categoryId, inspectionFee: dto.inspectionFee });
    } else {
      fee.inspectionFee = dto.inspectionFee;
    }

    return this.fees.save(fee);
  }
}