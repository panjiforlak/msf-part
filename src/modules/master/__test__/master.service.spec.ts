import { Test, TestingModule } from '@nestjs/testing';
import { MasterService } from '../master.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Categories } from '../entities/category.entity';
import { Items } from '../entities/master.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, HttpException } from '@nestjs/common';
import { CreateMasterDto } from '../dto/master.dto';

const mockCategoryRepo = () => ({
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
});

const mockItemRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
});

describe('MasterService', () => {
  let service: MasterService;
  let categoryRepository: ReturnType<typeof mockCategoryRepo>;
  let itemsRepository: ReturnType<typeof mockItemRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MasterService,
        {
          provide: getRepositoryToken(Categories),
          useFactory: mockCategoryRepo,
        },
        {
          provide: getRepositoryToken(Items),
          useFactory: mockItemRepo,
        },
      ],
    }).compile();

    service = module.get<MasterService>(MasterService);
    categoryRepository = module.get(getRepositoryToken(Categories));
    itemsRepository = module.get(getRepositoryToken(Items));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateMasterDto = {
      title: 'Test',
      description: 'desc',
      link: 'link',
      icon: 'icon',
      category_id: 1,
    };

    it('should create and return master item', async () => {
      itemsRepository.findOne.mockResolvedValue(null);
      itemsRepository.create.mockReturnValue(dto);
      itemsRepository.save.mockResolvedValue(dto);

      const result = await service.create(dto);

      expect(result.message).toBe('Create new master item successfully');
      expect(result.data?.title).toBe(dto.title);
    });

    it('should throw conflict if title already exists', async () => {
      itemsRepository.findOne.mockResolvedValue(dto);
      await expect(service.create(dto)).rejects.toThrow(HttpException);
    });

    it('should throw InternalServerErrorException if DB fails', async () => {
      itemsRepository.findOne.mockRejectedValue(new Error('DB error'));
      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    const dto: CreateMasterDto = {
      title: 'Updated',
      description: 'desc',
      link: 'link',
      icon: 'icon',
      category_id: 1,
    };

    it('should update and return master item', async () => {
      const existingItem = { id: 1, ...dto };
      itemsRepository.findOne.mockResolvedValue(existingItem);
      itemsRepository.merge.mockReturnValue({ ...existingItem, ...dto });
      itemsRepository.save.mockResolvedValue({ ...existingItem, ...dto });

      const result = await service.update(1, dto);

      expect(result.message).toBe('Master item updated successfully');
      expect(result.data?.title).toBe(dto.title);
    });

    it('should throw not found if item does not exist', async () => {
      itemsRepository.findOne.mockResolvedValue(null);
      await expect(service.update(1, dto)).rejects.toThrow(HttpException);
    });

    it('should throw InternalServerErrorException if DB fails', async () => {
      itemsRepository.findOne.mockRejectedValue(new Error('DB error'));
      await expect(service.update(1, dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAllMasterData', () => {
    it('should return paginated data', async () => {
      const mockGetManyAndCount = jest.fn().mockResolvedValue([
        [
          {
            name: 'category A',
            items: [
              {
                id: 1,
                title: 'Item 1',
                description: 'Desc 1',
                icon: 'icon1',
                link: 'link1',
              },
            ],
          },
        ],
        1,
      ]);

      categoryRepository.createQueryBuilder = jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: mockGetManyAndCount,
      }));

      const result = await service.findAllMasterData({
        page: '1',
        limit: '10',
      });

      expect(result.message).toBe('Get all Master successfully');
    });

    it('should handle DB error and throw InternalServerErrorException', async () => {
      categoryRepository.createQueryBuilder = jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockRejectedValue(new Error('DB Error')),
      }));

      await expect(
        service.findAllMasterData({ page: '1', limit: '10' }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should call where with search query', async () => {
      const mockWhere = jest.fn().mockReturnThis();

      categoryRepository.createQueryBuilder = jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: mockWhere,
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      }));

      await service.findAllMasterData({
        page: '1',
        limit: '10',
        search: 'cat',
      });

      expect(mockWhere).toHaveBeenCalledWith('category.name ILIKE :search', {
        search: '%cat%',
      });
    });
  });

  describe('findByTitle', () => {
    it('should return item by title', async () => {
      const item = { id: 1, title: 'Test' };
      itemsRepository.findOne.mockResolvedValue(item);
      const result = await service.findByTitle('Test');
      expect(result).toEqual(item);
    });

    it('should return null if item not found', async () => {
      itemsRepository.findOne.mockResolvedValue(null);
      const result = await service.findByTitle('NotFound');
      expect(result).toBeNull();
    });
  });
});
