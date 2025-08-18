import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../../common/helpers/response.helper';
import { paginateResponse } from '../../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { CreateActivityDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private repository: Repository<Activity>,
  ) {}

  async findAll(query: ParamsDto): Promise<ApiResponse<Activity[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const whereCondition = query.search
        ? { name: query.search as any } // pastikan sesuai enum
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
      console.log(error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch Activity list');
    }
  }

  async findById(id: number): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { id: id },
      });

      if (!result) {
        throwError('Activity not found', 404);
      }

      const response: any = {
        id: result.id,
        name: result.name,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get Activity detail');
    }
  }

  async create(
    data: CreateActivityDto,
    userId: number,
  ): Promise<ApiResponse<ResponseDto>> {
    try {
      const existing = await this.repository.findOne({
        where: { name: data.name },
      });
      if (existing) {
        throwError(`Activity name already exists`, 409);
      }

      const newBody = this.repository.create({
        ...data,
        createdBy: userId,
      });

      const result = await this.repository.save(newBody);
      const response = plainToInstance(ResponseDto, result);

      return successResponse(response, 'Create new activity successfully', 201);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create activity');
    }
  }

  async update(
    id: number,
    updateDto: UpdateDto,
    userId: number,
  ): Promise<ApiResponse<Activity>> {
    try {
      const activity = await this.repository.findOne({
        where: { id },
      });

      if (!activity) {
        throwError('Activity not found', 404);
      }

      if (updateDto.name) {
        const existingVin = await this.repository.findOne({
          where: {
            name: updateDto.name,
            id: Not(id),
          },
        });
        if (existingVin) {
          throwError('Activity name already in use another activity', 409);
        }
      }

      const updatedBody = this.repository.merge(activity!, updateDto, {
        updatedBy: userId,
      });

      const result = await this.repository.save(updatedBody);

      const response: any = {
        id: result.id,
      };
      return successResponse(response, 'Activity updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Activity');
    }
  }

  async remove(id: number, userId: number): Promise<ApiResponse<null>> {
    try {
      const items = await this.repository.findOne({
        where: { id },
      });

      if (!items) {
        throwError('Activity not found', 404);
      }

      items!.deletedBy = userId;

      await this.repository.save(items!);
      await this.repository.softRemove(items!);

      return successResponse(null, 'Activity deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error.stack);
      throw new InternalServerErrorException('Failed to delete Activity');
    }
  }
}
