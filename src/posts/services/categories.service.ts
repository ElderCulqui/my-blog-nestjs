import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    const categories = await this.categoriesRepository.find({
      order: { name: 'ASC' }
    });
    return categories;
  }

  async getCategoryById(id: number) {
    const category = await this.findOne(id);
    return category;
  }

  async getPostsByCategoryId(id: number) {
    const category = await this.findCategoryById(id, ['posts']);
    return category;
  }

  async create(body: CreateCategoryDto) {
    try {
      const newCategory = await this.categoriesRepository.save(body);
      return newCategory;
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new BadRequestException('Category name already exists');
      }
      throw new BadRequestException('Error creating category');
    }
  }

  async update(id: number, body: UpdateCategoryDto) {
    try {
      const category = await this.findOne(id);
      const updatedCategory = this.categoriesRepository.merge(category, body);
      const savedCategory = await this.categoriesRepository.save(updatedCategory);
      return savedCategory;
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new BadRequestException('Category name already exists');
      }
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number) {
    try {
      const category = await this.findOne(id);
      await this.categoriesRepository.delete(id);
      return { message: 'Category deleted' };
    } catch (error) {
      throw new BadRequestException('Error deleting category');
    }
  }

  findOne(id: number) {
    return this.findCategoryById(id);
  }

  remove(id: number) {
    return this.delete(id);
  }

  private async findCategoryById(id: number, relations: string[] = []) {
    const category = await this.categoriesRepository.findOne({ 
      where: { id },
      relations: relations
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }
}
