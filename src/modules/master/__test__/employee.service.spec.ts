import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from '../employee/employee.service';
import {
  Employee,
  EmploymentStatus,
} from '../employee/entities/employee.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateEmployeeDto, QueryParamDto } from '../employee/dto/employee.dto';
import { HttpException, InternalServerErrorException } from '@nestjs/common';

const mockEmployeeRepository = () => ({
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  merge: jest.fn(),
  softRemove: jest.fn(),
});

const mockEmployee: Employee = {
  id: 1,
  nip: '1234',
  first_name: 'Edhy',
  last_name: 'Prabowo',
  division: 'IT',
  position: 'Engineer',
  sallary: '1000',
  status: EmploymentStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
describe('EmployeeService', () => {
  let service: EmployeeService;
  let repository: jest.Mocked<Repository<Employee>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useFactory: mockEmployeeRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    repository = module.get(getRepositoryToken(Employee));
  });

  describe('findByNip', () => {
    it('should return employee by nip', async () => {
      const mockEmployee = { id: 1, nip: '1234' } as Employee;
      repository.findOne.mockResolvedValueOnce(mockEmployee);

      const result = await service.findByNip('1234');
      expect(result).toEqual(mockEmployee);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: [{ nip: '1234' }],
        withDeleted: false,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated employee list without search', async () => {
      const query: QueryParamDto = { page: '1', limit: '10' };

      const mockList = [mockEmployee];
      repository.findAndCount.mockResolvedValueOnce([mockList, 1]);

      const result = await service.findAll(query);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { id: 'DESC' },
        skip: 0,
        take: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.message).toBe('Get all employee susccessfuly');
    });

    it('should return filtered employee list when search query is present', async () => {
      const query: QueryParamDto = {
        page: '1',
        limit: '10',
        search: 'Edhy',
      };

      repository.findAndCount.mockResolvedValueOnce([[mockEmployee], 1]);

      const result = await service.findAll(query);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: [
          { first_name: ILike('%Edhy%') },
          { last_name: ILike('%Edhy%') },
        ],
        order: { id: 'DESC' },
        skip: 0,
        take: 10,
      });

      expect(result.data?.[0].first_name).toBe('Edhy');
    });

    it('should throw InternalServerErrorException on error', async () => {
      repository.findAndCount.mockRejectedValueOnce(new Error('DB error'));

      await expect(service.findAll({ page: '1', limit: '10' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('create', () => {
    it('should create a new employee', async () => {
      const dto: CreateEmployeeDto = {
        nip: '1234',
        first_name: 'Edhy',
        last_name: 'Doe',
        division: 'IT',
        position: 'Engineer',
        sallary: '1000',
        status: EmploymentStatus.ACTIVE,
      };
      const mockEmployee: Employee = {
        id: 1,
        nip: '1234',
        first_name: 'Edhy',
        last_name: 'Doe',
        division: 'IT',
        position: 'Engineer',
        sallary: '1000',
        status: EmploymentStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(dto as any);
      repository.save.mockResolvedValue({ ...mockEmployee });

      const result = await service.create(dto);
      expect(result.data).toMatchObject({ id: 1, nip: '1234' });
    });

    it('should throw conflict if nip exists', async () => {
      repository.findOne.mockResolvedValueOnce({ nip: '1234' } as Employee);
      await expect(
        service.create({ nip: '1234' } as CreateEmployeeDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update existing employee', async () => {
      const dto = {
        nip: '1234',
        first_name: 'Jane',
        last_name: 'Doe',
        division: 'HR',
        position: 'Manager',
        sallary: '2000',
        status: EmploymentStatus.ACTIVE,
      };

      const existing = { id: 1, nip: '1234' } as Employee;
      repository.findOne.mockResolvedValueOnce(existing);
      repository.findOne.mockResolvedValueOnce(null);
      repository.merge.mockReturnValue({ ...existing, ...dto });
      repository.save.mockResolvedValue({ ...mockEmployee });

      const result = await service.update(1, dto as CreateEmployeeDto);
      expect(result.data).toMatchObject({ id: 1, nip: '1234' });
    });
    it('should throw error if employee not found', async () => {
      const dto: CreateEmployeeDto = {
        nip: '1234',
        first_name: 'Jane',
        last_name: 'Doe',
        division: 'HR',
        position: 'Manager',
        sallary: '2000',
        status: EmploymentStatus.ACTIVE,
      };
      repository.findOne.mockResolvedValue(null);
      await expect(service.update(1, dto)).rejects.toThrow(HttpException);
    });
    it('should throw InternalServerErrorException on unexpected error', async () => {
      const dto: CreateEmployeeDto = {
        nip: '1234',
        first_name: 'Jane',
        last_name: 'Doe',
        division: 'HR',
        position: 'Manager',
        sallary: '2000',
        status: EmploymentStatus.ACTIVE,
      };

      // Simulasikan error saat findOne
      repository.findOne.mockRejectedValueOnce(new Error('DB error'));

      await expect(service.update(1, dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete employee', async () => {
      const mockEmp = { id: 1 } as Employee;
      repository.findOne.mockResolvedValueOnce(mockEmp);
      repository.softRemove.mockResolvedValueOnce(mockEmp);

      const result = await service.remove(1);
      expect(repository.softRemove).toHaveBeenCalledWith(mockEmp);
      expect(result.message).toBe('Employee deleted successfully');
    });

    it('should throw error if employee not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(HttpException);
    });
    it('should remove throw InternalServerErrorException on unexpected error', async () => {
      repository.findOne.mockRejectedValueOnce(new Error('DB error'));

      await expect(service.remove(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findById', () => {
    it('should return employee data', async () => {
      repository.findOne.mockResolvedValueOnce(mockEmployee);
      const result = await service.findById(1);
      expect(result.data.first_name).toBe('Edhy');
    });

    it('should throw not found if employee not exists', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(HttpException);
    });

    it('should throw error if employee is not active', async () => {
      repository.findOne.mockResolvedValue({ status: 'inactive' } as Employee);
      await expect(service.findById(1)).rejects.toThrow(HttpException);
    });
  });
});
