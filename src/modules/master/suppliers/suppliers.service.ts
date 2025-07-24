import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Suppliers } from './entities/suppliers.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../../common/helpers/response.helper';
import { paginateResponse } from '../../../common/helpers/public.helper';
import * as bcrypt from 'bcrypt';
import {
  GetSuppliersQueryDto,
  QueryParamDto,
  CreateSuppliersDto,
  ReturnResponseDto,
} from './dto/suppliers.dto';
import { plainToInstance } from 'class-transformer';
import { title } from 'process';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Suppliers)
    private suppliersRepository: Repository<Suppliers>,
  ) {}

  async findBySupplierName(supplier_name: string): Promise<Suppliers | null> {
    return this.suppliersRepository.findOne({
      where: [{ supplier_name }],
      withDeleted: false,
    });
  }

  async findAll(
    query: QueryParamDto,
  ): Promise<ApiResponse<GetSuppliersQueryDto[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.suppliersRepository.findAndCount({
        where: query.search
          ? [{ supplier_name: ILike(`%${query.search}%`) }]
          : {},
        withDeleted: false,
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });

      const transformedResult = plainToInstance(GetSuppliersQueryDto, result, {
        excludeExtraneousValues: true,
      });

      return paginateResponse(
        transformedResult,
        total,
        page,
        limit,
        'Get all supplier susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch suppliers');
    }
  }

  async findById(id: number): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.suppliersRepository.findOne({
        where: { id },
      });

      if (!result) {
        throwError('Supplier not found', 404);
      }

      const response: any = {
        id: result.id,
        uuid: result.uuid,
        item_id: result.item_id,
        supplier_name: result.supplier_name,
        remarks: result.remarks,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get suppliers');
    }
  }

  async create(
    data: CreateSuppliersDto,
    userId: number,
  ): Promise<ApiResponse<ReturnResponseDto>> {
    try {
      const existing = await this.findBySupplierName(data.supplier_name);
      if (existing) {
        throwError(`Supplier name ${data.supplier_name} already exists`, 409);
      }

      const newBody = this.suppliersRepository.create({
        ...data,
        createdBy: userId,
      });

      const result = await this.suppliersRepository.save(newBody);

      const response: ReturnResponseDto = {
        id: result.id,
        uuid: result.uuid,
        supplier_name: result.supplier_name,
        supplier_address: result.supplier_address,
        item_id: result.item_id,
        remarks: result.remarks,
      };

      return successResponse(response, 'Create new supplier successfully', 201);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create supplier');
    }
  }

  async update(
    id: number,
    updateDto: CreateSuppliersDto,
    userId: number,
  ): Promise<ApiResponse<Suppliers>> {
    try {
      const vehicles = await this.suppliersRepository.findOne({
        where: { id },
      });
      if (!vehicles) {
        throwError('Supplier not found', 404);
      }
      if (updateDto.supplier_name) {
        const existingCheck = await this.suppliersRepository.findOne({
          where: {
            supplier_name: updateDto.supplier_name,
            id: Not(id),
          },
        });
        if (existingCheck) {
          throwError('Supplier name already in use by another supplier', 409);
        }
      }

      const updatedSuppliers = this.suppliersRepository.merge(
        vehicles!,
        updateDto,
        { updatedBy: userId },
      );

      const result = await this.suppliersRepository.save(updatedSuppliers);
      const response: any = {
        id: result.id,
        uuid: result.uuid,
        supplier_name: result.supplier_name,
        supplier_address: result.supplier_address,
        item_id: result.item_id,
        remarks: result.remarks,
      };
      return successResponse(response, 'Supplier updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Supplier');
    }
  }

  async remove(id: number, userId: number): Promise<ApiResponse<null>> {
    try {
      const suppliers = await this.suppliersRepository.findOne({
        where: { id },
      });

      if (!suppliers) {
        throwError('suppliers not found', 404);
      }

      suppliers!.deletedBy = userId;

      await this.suppliersRepository.save(suppliers!);
      await this.suppliersRepository.softRemove(suppliers!);

      return successResponse(null, 'suppliers deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete suppliers');
    }
  }
}
