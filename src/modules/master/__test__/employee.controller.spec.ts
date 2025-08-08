import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from '../employee/employee.controller';
import { EmployeeService } from '../employee/employee.service';
import { JwtAuthGuard } from '../../../common/guard/jwt-auth.guard';
import { CreateEmployeeDto, QueryParamDto } from '../employee/dto/employee.dto';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  const mockEmployeeService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // bypass guard
      .compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll with query', async () => {
      const query: QueryParamDto = { search: 'John', page: '1', limit: '10' };
      const expectedResult = [{ id: 1, name: 'John Doe' }];

      mockEmployeeService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service.findById with id', async () => {
      const id = 1;
      const expectedResult = { id, name: 'Jane Doe' };

      mockEmployeeService.findById.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);
      expect(service.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateEmployeeDto = {
        nip: 'NIP123',
        first_name: 'New',
        last_name: 'Employee',
        position: 'Developer',
        division: 'Tech',
        sallary: '999999',
      };

      const expectedResult = { id: 1, ...dto };

      mockEmployeeService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const id = 1;
      const dto: CreateEmployeeDto = {
        nip: 'NIP123',
        first_name: 'New',
        last_name: 'Employee',
        position: 'Developer',
        division: 'Tech',
        sallary: '999999',
      };

      const expectedResult = { id, ...dto };

      mockEmployeeService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  // describe('remove', () => {
  //   it('should call service.remove with id', async () => {
  //     const id = 1;
  //     const expectedResult = { success: true };

  //     mockEmployeeService.remove.mockResolvedValue(expectedResult);

  //     const result = await controller.remove(id);
  //     // expect(service.remove).toHaveBeenCalledWith(id);
  //     expect(result).toEqual(expectedResult);
  //   });
  // });
});
