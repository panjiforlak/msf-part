import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workingarea } from './entities/workingarea.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../../common/helpers/response.helper';
import { paginateResponse } from '../../../common/helpers/public.helper';
import * as bcrypt from 'bcrypt';

import { CreateDto } from './dto/create.dto';
import { plainToInstance } from 'class-transformer';
import { ParamsDto } from './dto/param.dto';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class WorkingareaService {
  constructor(
    @InjectRepository(Workingarea)
    private Repository: Repository<Workingarea>,
  ) {}

  async findBySupplierName(
    working_area_code: string,
  ): Promise<Workingarea | null> {
    return this.Repository.findOne({
      where: [{ working_area_code }],
      withDeleted: false,
    });
  }

  // findAll
  async findAll(query: ParamsDto): Promise<ApiResponse<Workingarea[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.Repository.findAndCount({
        where: query.search
          ? [{ working_area_code: ILike(`%${query.search}%`) }]
          : {},
        withDeleted: false,
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });

      const transformedResult = plainToInstance(Workingarea, result, {
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
      throw new InternalServerErrorException('Failed to fetch working area');
    }
  }

  async findById(id: number): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.Repository.findOne({
        where: { id },
      });

      if (!result) {
        throwError('Workingarea not found', 404);
      }

      const response: any = {
        id: result.id,
        uuid: result.uuid,
        working_area_code: result.working_area_code,
        working_area_type: result.working_area_type,
        working_area_availability: result.working_area_availability,
        working_area_status: result.working_area_status,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get workingarea');
    }
  }

  async create(
    data: CreateDto,
    userId: number,
  ): Promise<ApiResponse<ResponseDto>> {
    try {
      const existing = await this.findBySupplierName(data.working_area_code);
      if (existing) {
        throwError(`Code ${data.working_area_code} already in use`, 409);
      }

      const newBody = this.Repository.create({
        ...data,
        createdBy: userId,
      });
      const result = await this.Repository.save(newBody);

      const response: ResponseDto = {
        id: result.id,
        uuid: result.uuid,
        working_area_code: result.working_area_code,
        working_area_type: result.working_area_type,
        working_area_availability: result.working_area_availability,
        working_area_status: result.working_area_status,
        barcode: result.barcode,
        remarks: result.remarks,
      };

      return successResponse(response, 'Create new supplier successfully', 201);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create working area');
    }
  }

  //comand dlu
  // async update(
  //   id: number,
  //   updateDto: CreateSuppliersDto,
  //   userId: number,
  // ): Promise<ApiResponse<Suppliers>> {
  //   try {
  //     const vehicles = await this.Repository.findOne({
  //       where: { id },
  //     });
  //     if (!vehicles) {
  //       throwError('Supplier not found', 404);
  //     }
  //     if (updateDto.supplier_name) {
  //       const existingCheck = await this.Repository.findOne({
  //         where: {
  //           supplier_name: updateDto.supplier_name,
  //           id: Not(id),
  //         },
  //       });
  //       if (existingCheck) {
  //         throwError('Supplier name already in use by another supplier', 409);
  //       }
  //     }

  //     const updatedSuppliers = this.Repository.merge(vehicles!, updateDto, {
  //       updatedBy: userId,
  //     });

  //     const result = await this.Repository.save(updatedSuppliers);
  //     const response: any = {
  //       id: result.id,
  //       uuid: result.uuid,
  //       supplier_name: result.supplier_name,
  //       supplier_address: result.supplier_address,
  //       item_id: result.item_id,
  //       remarks: result.remarks,
  //     };
  //     return successResponse(response, 'Supplier updated successfully');
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException('Failed to update Supplier');
  //   }
  // }

  // async remove(id: number, userId: number): Promise<ApiResponse<null>> {
  //   try {
  //     const suppliers = await this.Repository.findOne({
  //       where: { id },
  //     });

  //     if (!suppliers) {
  //       throwError('suppliers not found', 404);
  //     }

  //     suppliers!.deletedBy = userId;

  //     await this.Repository.save(suppliers!);
  //     await this.Repository.softRemove(suppliers!);

  //     return successResponse(null, 'suppliers deleted successfully');
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException('Failed to delete suppliers');
  //   }
  // }
}
