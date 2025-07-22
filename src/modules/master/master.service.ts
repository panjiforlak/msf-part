import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import {
  GetMasterDataQueryDto,
  GetMasterDataDto,
  CreateMasterDto,
  MasterResponseDto,
} from './dto/master.dto';
import { Items } from './entities/master.entity';
import { throwError } from '../../common/helpers/response.helper';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryRepository: Repository<Categories>,
    @InjectRepository(Items)
    private readonly itemsRepository: Repository<Items>,
  ) {}

  async findByTitle(title: string): Promise<Items | null> {
    return this.itemsRepository.findOne({
      where: {
        title,
      },
    });
  }

  async findAllMasterData(
    query: GetMasterDataQueryDto,
  ): Promise<ApiResponse<GetMasterDataDto[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const qb = this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.items', 'item', 'item.is_active = true');

      if (query.search) {
        qb.where('category.name ILIKE :search', {
          search: `%${query.search}%`,
        });
      }

      qb.skip(skip).take(limit);

      const [result, total] = await qb.getManyAndCount();

      const data: GetMasterDataDto[] = result.map((category) => ({
        category: category.name,
        items: (category.items ?? []).map((item) => ({
          id: item.id,
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

  async findAllItems(
    query: GetMasterDataQueryDto,
  ): Promise<ApiResponse<GetMasterDataDto[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const qb = this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.items', 'item', 'item.is_active = true');

      if (query.search) {
        qb.where('category.name ILIKE :search', {
          search: `%${query.search}%`,
        });
      }

      qb.skip(skip).take(limit);

      const [result, total] = await qb.getManyAndCount();

      const data: GetMasterDataDto[] = result.map((category) => ({
        category: category.name,
        items: (category.items ?? []).map((item) => ({
          id: item.id,
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

  async create(data: CreateMasterDto): Promise<ApiResponse<MasterResponseDto>> {
    try {
      const existing = await this.findByTitle(data.title);
      if (existing) {
        throwError('Master already registered', 409);
      }

      const newMasterItem = this.itemsRepository.create(data);
      const result = await this.itemsRepository.save(newMasterItem);
      const response: MasterResponseDto = {
        title: result.title,
        description: result.description,
        link: result.link,
      };

      return successResponse(
        response,
        'Create new master item successfully',
        201,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(
    id: number,
    data: CreateMasterDto,
  ): Promise<ApiResponse<MasterResponseDto>> {
    try {
      const masterItem = await this.itemsRepository.findOne({ where: { id } });

      if (!masterItem) {
        throwError('Master item not found', 404);
      }

      const updatedMasterItem = this.itemsRepository.merge(masterItem!, data);
      const result = await this.itemsRepository.save(updatedMasterItem);
      const response: MasterResponseDto = {
        title: result.title,
        description: result.description,
        link: result.link,
      };

      return successResponse(response, 'Master item updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update master item');
    }
  }
}
