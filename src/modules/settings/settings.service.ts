import {
  Injectable,
  InternalServerErrorException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from './entities/settings.entity';
import { ILike, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse, slugify } from '../../common/helpers/public.helper';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import {
  GetSettingsQueryDto,
  UpdateSettingsDto,
  CreatedSettingsDto,
  SettingsResponseDto,
} from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async findByKey(key: string): Promise<ApiResponse<any>> {
    const result: any = await this.settingsRepository.findOne({
      where: { key: key },
    });
    if (!result) {
      throwError('Settings not found', 404);
    }
    const response: any = {
      value: result.value,
    };
    return successResponse(response);
  }

  async checkKey(key: string): Promise<Settings | null> {
    return this.settingsRepository.findOne({
      where: {
        key,
        isActive: true,
      },
      withDeleted: false,
    });
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
        'Retrieve data settings susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch settings');
    }
  }

  async updateAll(
    updateDto: Record<string, string>,
  ): Promise<ApiResponse<any>> {
    try {
      const entries = Object.entries(updateDto);

      for (const [key, value] of entries) {
        await this.settingsRepository.update({ key }, { value });
      }

      const results = await this.settingsRepository.find();

      return successResponse(
        results.map((r) => ({
          key: r.key,
          value: r.value,
        })),
        'All settings updated successfully',
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update settings');
    }
  }

  async create(
    data: CreatedSettingsDto,
  ): Promise<ApiResponse<SettingsResponseDto>> {
    try {
      const existing = await this.checkKey(data.key);
      if (existing) {
        throwError('Setting key already exists!', 409);
      }

      const slugKey = slugify(data.key);
      data.key = slugKey;

      const newUser = this.settingsRepository.create(data);
      const result = await this.settingsRepository.save(newUser);
      const response: SettingsResponseDto = {
        id: result.id,
        key: result.key,
        value: result.value,
      };

      return successResponse(response, 'Create new setting successfully', 201);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create setting');
    }
  }
}
