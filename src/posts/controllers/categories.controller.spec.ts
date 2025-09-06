import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../services/categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto = { name: 'Technology' };
      const result = { id: 1, ...createCategoryDto };
      
      mockCategoriesService.create.mockReturnValue(result);

      expect(await controller.create(createCategoryDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = [{ id: 1, name: 'Technology' }];
      mockCategoriesService.findAll.mockReturnValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const result = { id: 1, name: 'Technology' };
      mockCategoriesService.findOne.mockReturnValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto = { name: 'Updated Technology' };
      const result = { id: 1, ...updateCategoryDto };
      
      mockCategoriesService.update.mockReturnValue(result);

      expect(await controller.update(1, updateCategoryDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const result = { message: 'Category deleted' };
      mockCategoriesService.remove.mockReturnValue(result);

      expect(await controller.remove(1)).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
