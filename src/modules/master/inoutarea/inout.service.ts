import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InboundOutboundArea } from './entities/inout.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../../common/helpers/response.helper';
import { paginateResponse } from '../../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';

@Injectable()
export class InOutAreaService {
  constructor(
    @InjectRepository(InboundOutboundArea)
    private repository: Repository<InboundOutboundArea>,
  ) {}

  // async findByItemNumberInternal(
  //   inventory_internal_code: string,
  // ): Promise<Storagearea | null> {
  //   return this.repository.findOne({
  //     where: [{ inventory_internal_code }],
  //     withDeleted: false,
  //   });
  // }

  async findAll(query: ParamsDto): Promise<ApiResponse<InboundOutboundArea[]>> {
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
        'Get all Inbound Outbound area susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to fetch Inbound Outbound Area',
      );
    }
  }

  async findById(slug: string): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { barcode: slug },
      });

      if (!result) {
        throwError('Storage Area not found', 404);
      }

      const response: any = {
        id: result.id,
        barcode: result.barcode,
        storage_type: result.storage_type,
        storage_availability: result.storage_availability,
        status: result.status,
        remarks: result.remarks,
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
    data: CreateDto,
    userId: number,
  ): Promise<ApiResponse<ResponseDto>> {
    try {
      // const existing = await this.findByItemNumberInternal(
      //   data.inventory_internal_code ?? '',
      // );
      // if (existing) {
      //   throwError(
      //     `Item Number ${data.inventory_internal_code} already exists`,
      //     409,
      //   );
      // }

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
  ): Promise<ApiResponse<InboundOutboundArea>> {
    try {
      const inout = await this.repository.findOne({
        where: { barcode },
      });

      if (!inout) {
        throwError('Inbound outbound area not found', 404);
      }
      if (updateDto.inout_area_code) {
        const existingCheck = await this.repository.findOne({
          where: {
            inout_area_code: updateDto.inout_area_code,
            barcode: Not(barcode),
          },
        });
        if (existingCheck) {
          throwError('InOut code already in use by another area', 409);
        }
      }
      const updatedBody = this.repository.merge(inout!, updateDto, {
        updatedBy: userId,
      });

      const result = await this.repository.save(updatedBody);

      const response: any = {
        id: result.id,
      };
      return successResponse(response, 'InOut area updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update InOut area');
    }
  }

  async remove(barcode: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const items = await this.repository.findOne({
        where: { barcode },
      });

      if (!items) {
        throwError('Inbound Outbound area not found', 404);
      }

      items!.deletedBy = userId;

      await this.repository.save(items!);
      await this.repository.softRemove(items!);

      return successResponse(
        null,
        'Inbound Outbound area deleted successfully',
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error.stack);
      throw new InternalServerErrorException(
        'Failed to delete Inbound Outbound area',
      );
    }
  }
}
