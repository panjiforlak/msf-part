import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Storagearea } from './entities/storagearea.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../../common/helpers/response.helper';
import { paginateResponse } from '../../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { CreateStorageAreaDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';

@Injectable()
export class StorageareaService {
  constructor(
    @InjectRepository(Storagearea)
    private repository: Repository<Storagearea>,
  ) {}

  // async findByItemNumberInternal(
  //   inventory_internal_code: string,
  // ): Promise<Storagearea | null> {
  //   return this.repository.findOne({
  //     where: [{ inventory_internal_code }],
  //     withDeleted: false,
  //   });
  // }

  async findAll(query: ParamsDto): Promise<ApiResponse<Storagearea[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const whereCondition = query.search
        ? { storage_type: query.search as any } // pastikan sesuai enum
        : {};
      const [result, total] = await this.repository.findAndCount({
        where: whereCondition,
        withDeleted: false,
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });

      return paginateResponse(
        result,
        total,
        page,
        limit,
        'Get all storage area susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch storage area');
    }
  }

  async findById(barcode: string): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { barcode: barcode },
      });

      if (!result) {
        throwError('Storage Area not found', 404);
      }

      const response: any = {
        id: result.id,
        barcode: result.barcode,
        storage_code: result.storage_code,
        storage_type: result.storage_type,
        storage_availability: result.storage_availability,
        max_capacity: result.max_capacity,
        remarks: result.remarks,
        status: result.status,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get storage area');
    }
  }

  async create(
    data: CreateStorageAreaDto,
    userId: number,
  ): Promise<ApiResponse<ResponseDto>> {
    try {
      const existing = await this.repository.findOne({
        where: { storage_code: data.storage_code },
      });
      if (existing) {
        throwError(`Storage code already exists`, 409);
      }

      const newBody = this.repository.create({
        ...data,
        createdBy: userId,
      });

      const result = await this.repository.save(newBody);
      const response = plainToInstance(ResponseDto, result);

      return successResponse(
        response,
        'Create new storagearea successfully',
        201,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create storagearea');
    }
  }

  async update(
    barcode: string,
    updateDto: UpdateDto,
    userId: number,
  ): Promise<ApiResponse<Storagearea>> {
    try {
      const storage = await this.repository.findOne({
        where: { barcode },
      });

      if (!storage) {
        throwError('Storage not found', 404);
      }

      if (updateDto.storage_code) {
        const existingVin = await this.repository.findOne({
          where: {
            storage_code: updateDto.storage_code,
            barcode: Not(barcode),
          },
        });
        if (existingVin) {
          throwError('Storage Code already exist', 409);
        }
      }

      const updatedBody = this.repository.merge(storage!, updateDto, {
        updatedBy: userId,
      });

      const result = await this.repository.save(updatedBody);

      const response: any = {
        id: result.id,
      };
      return successResponse(response, 'Storage area updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Storage area');
    }
  }

  async remove(barcode: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const items = await this.repository.findOne({
        where: { barcode },
      });

      if (!items) {
        throwError('Storage area not found', 404);
      }

      items!.deletedBy = userId;

      await this.repository.save(items!);
      await this.repository.softRemove(items!);

      return successResponse(null, 'storage area deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error.stack);
      throw new InternalServerErrorException('Failed to delete storage area');
    }
  }
}
