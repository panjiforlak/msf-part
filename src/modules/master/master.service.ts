import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Items } from './entities/master.entity';
import { Categories } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import * as bcrypt from 'bcrypt';
import {
  CreateMasterDto,
  MasterResponseDto,
  GetMasterQueryDto,
  UpdateMasterDto,
  GetMasterDataQueryDto,
  GetMasterDataDto,
} from './dto/master.dto';
import { plainToInstance } from 'class-transformer';
import { title } from 'process';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Items)
    private masterRepository: Repository<Items>,
    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>,
  ) {}

  async findAll(query: GetMasterQueryDto): Promise<ApiResponse<Items[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.masterRepository.findAndCount({
        where: query.search ? [{ title: ILike(`%${query.search}%`) }] : {},
        skip,
        take: limit,
        relations: ['category'],
        withDeleted: false,
      });
      const transformedResult = plainToInstance(Items, result, {
        excludeExtraneousValues: true,
      });

      return paginateResponse(
        result,
        total,
        page,
        limit,
        'Get all Master susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findAllMasterData(
    query: GetMasterDataQueryDto,
  ): Promise<ApiResponse<GetMasterDataDto[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.categoryRepository.findAndCount({
        where: query.search
          ? [
              {
                name: ILike(`%${query.search}%`),
              },
            ]
          : {},
        skip,
        take: limit,
        relations: ['items'],
      });

      const data: GetMasterDataDto[] = result.map((category) => ({
        category: category.name,
        items: (category.items ?? []).map((item) => ({
          title: item.title,
          desc: item.description,
          icon: item.icon,
          link: item.link,
        })),
      }));

      return paginateResponse(
        data,
        total,
        page,
        limit,
        'Get all Master successfully',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error.stack);
      throw new InternalServerErrorException('Failed to fetch categories');
    }
  }
}
