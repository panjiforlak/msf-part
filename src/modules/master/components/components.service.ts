import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Components } from './entities/components.entity';
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
import { Inventory } from 'src/modules/inventory/entities/inventory.entity';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Components)
    private repository: Repository<Components>,
  ) {}

  // async findByItemNumberInternal(
  //   inventory_internal_code: string,
  // ): Promise<Storagearea | null> {
  //   return this.repository.findOne({
  //     where: [{ inventory_internal_code }],
  //     withDeleted: false,
  //   });
  // }

  async findAll(query: ParamsDto): Promise<ApiResponse<ResponseDto[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.repository.findAndCount({
        where: query.search
          ? [{ component_name: ILike(`%${query.search}%`) }]
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
        'Get all components area susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch components Area');
    }
  }

  async findById(uuid: string): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { uuid: uuid },
      });

      if (!result) {
        throwError('Storage Area not found', 404);
      }

      const response: any = {
        id: result.id,
        inventory_type: result.inventory_type,
        component_name: result.component_name,
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
      const existing = await this.repository.findOne({
        where: { component_name: data.component_name },
      });
      if (existing) {
        throwError(`Component already exists`, 409);
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
    uuid: string,
    updateDto: UpdateDto,
    userId: number,
  ): Promise<ApiResponse<Components>> {
    try {
      const components = await this.repository.findOne({
        where: { uuid },
      });

      if (!components) {
        throwError('components area not found', 404);
      }
      if (updateDto.component_name) {
        const existingComponent = await this.repository.findOne({
          where: {
            component_name: ILike(updateDto.component_name.toLowerCase()),
            uuid: Not(uuid),
          },
        });
        if (existingComponent) {
          throwError('Component name already in use by another component', 409);
        }
      }

      const updatedBody = this.repository.merge(components!, updateDto, {
        updatedBy: userId,
      });

      const result = await this.repository.save(updatedBody);

      const response: any = {
        id: result.id,
      };
      return successResponse(response, 'Components area updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update Components area',
      );
    }
  }

  async remove(uuid: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const items = await this.repository.findOne({
        where: { uuid },
      });

      if (!items) {
        throwError('components area not found', 404);
      }

      items!.deletedBy = userId;

      await this.repository.save(items!);
      await this.repository.softRemove(items!);

      return successResponse(null, 'components area deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete components area',
      );
    }
  }
}
