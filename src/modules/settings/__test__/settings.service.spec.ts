import { Test, TestingModule } from '@nestjs/testing';
import { SettingsService } from '../settings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Settings } from '../entities/settings.entity';
import { ILike, Repository } from 'typeorm';
import {
  CreatedSettingsDto,
  UpdateSettingsDto,
  GetSettingsQueryDto,
} from '../dto/settings.dto';
import { throwError } from '../../../common/helpers/response.helper';
import { InternalServerErrorException } from '@nestjs/common';

const mockSetting = {
  id: 1,
  key: 'site_name',
  value: 'MyApp',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('SettingsService', () => {
  let service: SettingsService;
  let repo: Repository<Settings>;

  const mockRepo = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(Settings),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    repo = module.get<Repository<Settings>>(getRepositoryToken(Settings));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find setting by key', async () => {
    mockRepo.findOne.mockResolvedValue(mockSetting);
    const result = await service.findByKey('site_name');
    expect(result.data.value).toEqual('MyApp');
  });

  it('should throw if setting not found by key', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findByKey('nonexistent')).rejects.toThrow(
      'Settings not found',
    );
  });

  it('should create a new setting', async () => {
    const dto: CreatedSettingsDto = {
      key: 'new_key',
      value: 'value',
    };
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(dto);
    mockRepo.save.mockResolvedValue({ id: 1, ...dto });

    const result = await service.create(dto);
    expect(result.data?.key).toContain('new_key');
  });

  it('should not create a setting if key already exists', async () => {
    mockRepo.findOne.mockResolvedValue(mockSetting);
    const dto: CreatedSettingsDto = {
      key: 'site_name',
      value: 'AnotherApp',
    };
    await expect(service.create(dto)).rejects.toThrow(
      'Setting key already exists!',
    );
  });

  it('should update existing setting', async () => {
    mockRepo.findOne.mockResolvedValue(mockSetting);
    const updateDto: UpdateSettingsDto = {
      value: 'UpdatedApp',
    };
    mockRepo.merge.mockReturnValue({ ...mockSetting, ...updateDto });
    mockRepo.save.mockResolvedValue({ ...mockSetting, ...updateDto });

    const result = await service.updateBySlug('site_name', updateDto);
    expect(result.statusCode).toEqual(200);
  });

  it('should throw error if setting to update not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(
      service.updateBySlug('missing_key', { value: 'abc' }),
    ).rejects.toThrow('Settings not found');
  });
});

describe('SettingsService - findAll', () => {
  let service: SettingsService;
  let repository: jest.Mocked<Repository<Settings>>;

  const mockRepository = {
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: getRepositoryToken(Settings),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
    repository = module.get(getRepositoryToken(Settings));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated settings with search', async () => {
    const query: GetSettingsQueryDto = {
      page: '1',
      limit: '10',
      search: 'email',
    };

    const fakeData = [
      {
        id: 1,
        key: 'email',
        value: 'example@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    repository.findAndCount.mockResolvedValueOnce([fakeData, 1]);

    const result = await service.findAll(query);

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: [{ key: ILike('%email%') }],
      skip: 0,
      take: 10,
    });

    expect(result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          key: 'email',
          value: 'example@gmail.com',
        }),
      ]),
    );
  });

  it('should return paginated settings without search', async () => {
    const query: GetSettingsQueryDto = {
      page: '2',
      limit: '5',
    };

    const fakeData = [
      {
        id: 2,
        key: 'site-name',
        value: 'MySite',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    repository.findAndCount.mockResolvedValueOnce([fakeData, 10]);

    const result = await service.findAll(query);

    expect(repository.findAndCount).toHaveBeenCalledWith({
      where: {},
      skip: 5,
      take: 5,
    });

    expect(result.message).toBe('Retrieve data settings susccessfuly');
    expect(result.data?.[0].key).toBe('site-name');
  });

  it('should throw InternalServerErrorException on error', async () => {
    const query: GetSettingsQueryDto = {
      page: '1',
      limit: '10',
    };

    repository.findAndCount.mockRejectedValue(new Error('DB failure'));

    await expect(service.findAll(query)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
