import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchInbound } from './entities/batchin.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';

@Injectable()
export class BatchInboundService {
  constructor(
    @InjectRepository(BatchInbound)
    private repository: Repository<BatchInbound>,
  ) {}

  async findByDocNo(barcode: string): Promise<BatchInbound | null> {
    return this.repository.findOne({
      where: [{ barcode }],
      withDeleted: false,
    });
  }

  async findAll(query: ParamsDto): Promise<ApiResponse<BatchInbound[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.repository.findAndCount({
        where: query.search ? [{ barcode: ILike(`%${query.search}%`) }] : {},
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
        'Get all batch inbound susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch batch inbound');
    }
  }

  async findAllPDA(
    picker_id: number,
    query: ParamsDto,
  ): Promise<ApiResponse<BatchInbound[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.repository.findAndCount({
        where: query.search
          ? [{ barcode: ILike(`%${query.search}%`) }]
          : { picker_id },
        withDeleted: false,
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
        relations: ['inventory'],
      });
      const mergedResult = result.map((batch) => {
        const {
          inventory: {
            inventory_code,
            inventory_internal_code,
            inventory_name,
            racks_id,
          } = {}, // fallback default empty object
          ...batchData
        } = batch;

        return {
          ...batchData,
          inventory_code,
          inventory_internal_code,
          inventory_name,
          racks_id,
        };
      });
      return paginateResponse(
        mergedResult,
        total,
        page,
        limit,
        'Get all batch inbound susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch batch inbound');
    }
  }

  //for api calling
  async findById(id: number): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { id },
      });

      if (!result) {
        throwError('Batch inbound not found', 404);
      }

      const response: any = {
        id: result.id,
        barcode: result.barcode,
        inventory_id: result.inventory_id,
        doc_ship_id: result.doc_ship_id,
        supplier_id: result.supplier_id,
        quantity: result.quantity,
        price: result.price,
        arrival_date: result.arrival_date,
        status_reloc: result.status_reloc,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get batch inbound');
    }
  }

  async findBySlug(slug: string): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { barcode: slug },
      });

      if (!result) {
        throwError('batch inbound not found', 404);
      }

      const response: any = {
        id: result.id,
        barcode: result.barcode,
        inventory_id: result.inventory_id,
        doc_ship_id: result.doc_ship_id,
        supplier_id: result.supplier_id,
        quantity: result.quantity,
        price: result.price,
        arrival_date: result.arrival_date,
        status_reloc: result.status_reloc,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get batch inbound');
    }
  }

  async create(
    data: CreateDto,
    userId: number,
  ): Promise<ApiResponse<ResponseDto>> {
    try {
      const newBody = this.repository.create({
        ...data,
        createdBy: userId,
      });

      const result = await this.repository.save(newBody);
      const response = plainToInstance(ResponseDto, result);

      return successResponse(
        response,
        'Create new batch inbound successfully',
        201,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create batch inbound');
    }
  }

  async createMany(
    data: CreateDto[],
    userId: number,
  ): Promise<ApiResponse<ResponseDto[]>> {
    try {
      const newRecords = data.map((item) =>
        this.repository.create({
          ...item,
          createdBy: userId,
        }),
      );

      const result = await this.repository.save(newRecords);
      const response = plainToInstance(ResponseDto, result);

      return successResponse(
        response,
        'Create batch inbound(s) successfully',
        201,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create batch inbound');
    }
  }

  async update(
    barcode: string,
    updateDto: UpdateDto,
    userId: number,
  ): Promise<ApiResponse<BatchInbound>> {
    try {
      const params = await this.repository.findOne({
        where: { barcode },
      });

      if (!params) {
        throwError('Batch Inbound not found', 404);
      }

      const updatedBody = this.repository.merge(params!, updateDto, {
        updatedBy: userId,
      });

      const result = await this.repository.save(updatedBody);

      const response: any = {
        id: result.id,
      };
      return successResponse(response, 'Batch Inbound updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Doc Batch');
    }
  }

  async remove(barcode: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const items = await this.repository.findOne({
        where: { barcode },
      });

      if (!items) {
        throwError('Batch inbound not found', 404);
      }

      items!.deletedBy = userId;

      await this.repository.save(items!);
      await this.repository.softRemove(items!);

      return successResponse(null, 'Batch inbound deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error.stack);
      throw new InternalServerErrorException('Failed to delete batch inbound');
    }
  }
}
