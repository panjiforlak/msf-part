import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from './entities/settings.entity';
import { ILike, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { GetSettingsQueryDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async findById(id: number): Promise<ApiResponse<any>> {
    const result: any = await this.settingsRepository.findOne({
      where: { id },
    });
    if (!result) {
      throwError('Roles not found', 404);
    }
    const response: any = {
      id: result.id,
      name: result.name,
    };
    return successResponse(response);
  }

  async findAll(query: GetSettingsQueryDto): Promise<ApiResponse<Settings[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.settingsRepository.findAndCount({
        where: query.search ? [{ key: ILike(`%${query.search}%`) }] : {},
        skip,
        take: limit,
      });
      const transformedResult = plainToInstance(Settings, result, {
        excludeExtraneousValues: true,
      });

      return paginateResponse(
        transformedResult,
        total,
        page,
        limit,
        'Get users susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }
}
