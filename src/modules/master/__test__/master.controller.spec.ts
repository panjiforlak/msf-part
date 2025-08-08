import { Test, TestingModule } from '@nestjs/testing';
import { MasterController } from '../master.controller';
import { MasterService } from '../master.service';
import { CreateMasterDto, GetMasterQueryDto } from '../dto/master.dto';

describe('MasterController', () => {
  let controller: MasterController;
  let service: MasterService;

  const mockMasterService = {
    findAllMasterData: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterController],
      providers: [
        {
          provide: MasterService,
          useValue: mockMasterService,
        },
      ],
    }).compile();

    controller = module.get<MasterController>(MasterController);
    service = module.get<MasterService>(MasterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAllMasterData with query and return result', async () => {
      const query: GetMasterQueryDto = {};
      const result = [{ id: 1, name: 'data1' }];
      mockMasterService.findAllMasterData.mockResolvedValue(result);

      const response = await controller.findAll(query);
      expect(service.findAllMasterData).toHaveBeenCalledWith(query);
      expect(response).toEqual(result);
    });
  });

  describe('create', () => {
    it('should call service.create with dto and return result', async () => {
      const dto: CreateMasterDto = {
        category_id: 1,
        title: 'example',
        description: 'test desc',
        icon: 'star',
        link: 'exampleType',
      };

      const result = { id: 1, ...dto };
      mockMasterService.create.mockResolvedValue(result);

      const response = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto and return result', async () => {
      const dto: CreateMasterDto = {
        category_id: 1,
        title: 'example',
        description: 'test desc',
        icon: 'star',
        link: 'exampleType',
      };
      const result = { id: 1, ...dto };
      mockMasterService.update.mockResolvedValue(result);

      const response = await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(response).toEqual(result);
    });
  });
});
