import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from '../settings.controller';
import { SettingsService } from '../settings.service';
import {
  GetSettingsQueryDto,
  CreatedSettingsDto,
  UpdateSettingsDto,
} from '../dto/settings.dto';

describe('SettingsController', () => {
  let controller: SettingsController;
  let service: SettingsService;

  const mockSettingsService = {
    findAll: jest.fn(),
    findByKey: jest.fn(),
    updateBySlug: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: mockSettingsService,
        },
      ],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
    service = module.get<SettingsService>(SettingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should call service.findAll with query', async () => {
      const query: GetSettingsQueryDto = { page: '1', limit: '10' };
      const expectedResult = { data: [], meta: { total: 0 } };
      mockSettingsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return setting by slug', async () => {
      const slug = 'site_name';
      const mockSetting = { key: slug, value: 'My Website' };
      mockSettingsService.findByKey.mockResolvedValue(mockSetting);

      const result = await controller.findOne(slug);
      expect(result).toEqual(mockSetting);
      expect(service.findByKey).toHaveBeenCalledWith(slug);
    });
  });

  describe('update', () => {
    it('should update setting by slug', async () => {
      const slug = 'site_name';
      const dto: UpdateSettingsDto = { value: 'Updated Website Name' };
      const updatedSetting = { key: slug, value: dto.value };
      mockSettingsService.updateBySlug.mockResolvedValue(updatedSetting);

      const result = await controller.update(slug, dto);
      expect(result).toEqual(updatedSetting);
      expect(service.updateBySlug).toHaveBeenCalledWith(slug, dto);
    });
  });

  describe('create', () => {
    it('should create a new setting', async () => {
      const dto: CreatedSettingsDto = {
        key: 'new_key',
        value: 'new_value',
      };
      const created = { id: 1, ...dto };
      mockSettingsService.create.mockResolvedValue(created);

      const result = await controller.create(dto);
      expect(result).toEqual(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
});
