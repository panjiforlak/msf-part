import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
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
import { ItemsSpnumLog } from './entities/items_spnum_log.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private repository: Repository<Inventory>,
    @InjectRepository(ItemsSpnumLog)
    private readonly spnumLogRepository: Repository<ItemsSpnumLog>,
  ) {}

  async findByItemNumberInternal(
    inventory_internal_code: string,
  ): Promise<Inventory | null> {
    return this.repository.findOne({
      where: [{ inventory_internal_code }],
      withDeleted: false,
    });
  }

  async findAll(query: ParamsDto): Promise<ApiResponse<Inventory[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.repository.findAndCount({
        where: query.search
          ? [{ inventory_name: ILike(`%${query.search}%`) }]
          : {},
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
        'Get all inventory susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch inventory');
    }
  }

  async findById(slug: string): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { uuid: slug },
      });

      if (!result) {
        throwError('Inventory not found', 404);
      }

      const response: any = {
        id: result.id,
        uuid: result.uuid,
        inventory_code: result.inventory_code,
        inventory_internal_code: result.inventory_internal_code,
        inventory_name: result.inventory_name,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get inventory');
    }
  }

  async create(
    data: CreateDto,
    userId: number,
  ): Promise<ApiResponse<ResponseDto>> {
    try {
      const existing = await this.findByItemNumberInternal(
        data.inventory_internal_code ?? '',
      );
      if (existing) {
        throwError(
          `Item Number ${data.inventory_internal_code} already exists`,
          409,
        );
      }

      const newBody = this.repository.create({
        ...data,
        createdBy: userId,
      });

      const result = await this.repository.save(newBody);
      const response = plainToInstance(ResponseDto, result);

      return successResponse(response, 'Create new items successfully', 201);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create items');
    }
  }

  async update(
    uuid: string,
    updateDto: UpdateDto,
    userId: number,
  ): Promise<ApiResponse<Inventory>> {
    try {
      const items = await this.repository.findOne({
        where: { uuid },
      });
      // log untuk perubahan item_number shacman atau item number internal
      const isItemNumberChanged =
        items?.inventory_code !== updateDto.inventory_code;

      if (isItemNumberChanged) {
        const log = this.spnumLogRepository.create({
          item_id: items?.id,
          inventory_code_old: items?.inventory_code,
          inventory_code_new: updateDto.inventory_code,
          updatedBy: userId,
        });

        await this.spnumLogRepository.save(log);
      }

      if (!items) {
        throwError('Items not found', 404);
      }
      if (updateDto.inventory_internal_code) {
        const existingCheck = await this.repository.findOne({
          where: {
            inventory_internal_code: updateDto.inventory_internal_code,
            uuid: Not(uuid),
          },
        });
        if (existingCheck) {
          throwError('Item name already in use by another Items', 409);
        }
      }

      const updatedBody = this.repository.merge(items!, updateDto, {
        updatedBy: userId,
      });

      const result = await this.repository.save(updatedBody);

      const response: any = {
        id: result.id,
        uuid: result.uuid,
        inventory_code: result.inventory_code,
        inventory_code_internal: result.inventory_internal_code,
        inventory_name: result.inventory_name,
        weight: result.weight,
      };
      return successResponse(response, 'inventory updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update inventory');
    }
  }

  async remove(uuid: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const items = await this.repository.findOne({
        where: { uuid },
      });

      if (!items) {
        throwError('items not found', 404);
      }

      items!.deletedBy = userId;

      await this.repository.save(items!);
      await this.repository.softRemove(items!);

      return successResponse(null, 'items deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete items');
    }
  }
}
