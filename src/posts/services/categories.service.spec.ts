import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = [{ id: 1, name: 'Technology' }];
      mockRepository.find.mockReturnValue(result);

      expect(await service.findAll()).toBe(result);
      expect(repository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' }
      });
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const result = { id: 1, name: 'Technology' };
      mockRepository.findOne.mockReturnValue(result);

      expect(await service.findOne(1)).toBe(result);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockRepository.findOne.mockReturnValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto = { name: 'Technology' };
      const result = { id: 1, ...createCategoryDto };
      mockRepository.save.mockReturnValue(result);

      expect(await service.create(createCategoryDto)).toBe(result);
    });

    it('should throw BadRequestException on duplicate name', async () => {
      const createCategoryDto = { name: 'Technology' };
      mockRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create(createCategoryDto)).rejects.toThrow(BadRequestException);
    });
  });
});
