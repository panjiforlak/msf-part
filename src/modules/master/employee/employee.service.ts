import {
  Injectable,
  InternalServerErrorException,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../../common/helpers/response.helper';
import {
  generateNIPWithInitial,
  generateSimpleNIP,
  paginateResponse,
} from '../../../common/helpers/public.helper';
import {
  GetEmployeeQueryDto,
  QueryParamDto,
  CreateEmployeeDto,
  ReturnResponseDto,
} from './dto/employee.dto';
import { plainToInstance } from 'class-transformer';
import {
  Employee,
  EmploymentStatus,
} from '../employee/entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findByNip(nip: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: [{ nip }],
      withDeleted: false,
    });
  }

  async findAll(
    query: QueryParamDto,
  ): Promise<ApiResponse<GetEmployeeQueryDto[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.employeeRepository.findAndCount({
        where: query.search
          ? [
              { first_name: ILike(`%${query.search}%`) },
              { last_name: ILike(`%${query.search}%`) },
            ]
          : {},
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });

      const transformedResult = plainToInstance(GetEmployeeQueryDto, result, {
        excludeExtraneousValues: true,
      });

      return paginateResponse(
        transformedResult,
        total,
        page,
        limit,
        'Get all employee susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch employees');
    }
  }

  async findById(id: number): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.employeeRepository.findOne({
        where: { id },
      });

      if (!result) {
        throwError('Employee not found', 404);
      }

      if (result.status !== 'active') {
        throwError('Employee has been deleted', 404);
      }

      const response: any = {
        id: result.id,
        nip: result.nip,
        first_name: result.first_name,
        last_name: result.last_name,
        division: result.division,
        position: result.position,
        sallary: result.sallary,
        status: result.status,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get employee');
    }
  }

  async create(
    data: CreateEmployeeDto,
  ): Promise<ApiResponse<ReturnResponseDto>> {
    try {
      const existing = await this.employeeRepository.findOne({
        where: {
          first_name: data.first_name,
          last_name: data.last_name,
        },
      });
      if (existing) {
        throwError(`Employe already registered`, 409);
      }

      const newEmployee = this.employeeRepository.create({
        ...data,
        status: data.status as EmploymentStatus,
        createdBy: 1,
      });

      const result = await this.employeeRepository.save(newEmployee);

      const response: ReturnResponseDto = {
        id: result.id,
        nip: result.nip,
        first_name: result.first_name,
        last_name: result.last_name,
        division: result.division,
        position: result.position,
        sallary: result.sallary,
        status: result.status,
      };

      return successResponse(response, 'Create new employee successfully', 201);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === '23505') {
        throwError('NIP already exists', 409);
      }
      console.log(error);
      throw new InternalServerErrorException('Failed to create employee');
    }
  }

  async update(
    id: number,
    updateDto: CreateEmployeeDto,
  ): Promise<ApiResponse<Employee>> {
    try {
      const employee = await this.employeeRepository.findOne({ where: { id } });
      if (!employee) {
        throwError('Employee not found', 404);
      }

      if (updateDto.nip) {
        const existingNip = await this.employeeRepository.findOne({
          where: {
            nip: updateDto.nip,
            id: Not(id),
          },
        });
        if (existingNip) {
          throwError('NIP already in use by another employee', 409);
        }
      }

      const updatedData = {
        ...updateDto,
        status: updateDto.status as EmploymentStatus,
      };

      const updateEmployee = this.employeeRepository.merge(
        employee!,
        updatedData,
      );
      const result = await this.employeeRepository.save(updateEmployee);

      const response: any = {
        id: result.id,
        nip: result.nip,
        first_name: result.first_name,
        last_name: result.last_name,
        division: result.division,
        position: result.position,
      };

      return successResponse(response, 'Employee updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Employee');
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const employee = await this.employeeRepository.findOne({ where: { id } });

      if (!employee) {
        throwError('Employee not found', 404);
      }
      await this.employeeRepository.softRemove(employee!);

      return successResponse(null, 'Employee deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete Employee');
    }
  }
}
