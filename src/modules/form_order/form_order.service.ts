import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { enumFormOrderStatus, FormOrder } from './entities/formOrder.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { CreateFormOrderDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class FormOrderService {
  constructor(
    @InjectRepository(FormOrder)
    private repository: Repository<FormOrder>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: ParamsDto): Promise<ApiResponse<any>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;
      const search = query.search?.toLowerCase() ?? '';

      const qb = this.repository
        .createQueryBuilder('fo')
        .select([
          'fo.uuid AS uuid',
          'i.inventory_name AS part_name',
          'fo.form_order_number AS form_order_number',
          'fo.quantity AS quantity',
          'fo.status AS status',
          'u.name AS "createdBy"',
          `TO_CHAR(u."createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"`,
        ])
        .leftJoin(
          'inventory',
          'i',
          'i.id = fo.inventory_id AND i."deletedAt" IS NULL',
        )
        .leftJoin('users', 'u', 'u.id = fo."createdBy"')
        .where('fo."deletedAt" IS NULL')
        .andWhere(
          'i.inventory_name ILIKE :search OR fo.form_order_number ILIKE :search',
          {
            search: `%${search}%`,
          },
        );

      if (search) {
        qb.andWhere('LOWER(fo.form_order_number) LIKE :search', {
          search: `%${search}%`,
        });
      }

      qb.offset(skip).limit(limit);

      const result = await qb.getRawMany();

      // hitung total data tanpa pagination
      const countQb = this.repository
        .createQueryBuilder('fo')
        .select('COUNT(DISTINCT fo.id)', 'total')
        .leftJoin(
          'inventory',
          'i',
          'i.id = fo.inventory_id AND i."deletedAt" IS NULL',
        )
        .leftJoin('users', 'u', 'u.id = fo."createdBy"')
        .where('fo."deletedAt" IS NULL')
        .andWhere(
          '(i.inventory_name ILIKE :search OR fo.form_order_number ILIKE :search)',
          { search: `%${search}%` },
        );

      const countResult = await countQb.getRawOne();
      const total = parseInt(countResult?.total ?? '0', 10);
      const parsed = result.map((item) => ({
        ...item,
      }));
      return paginateResponse(
        parsed,
        total,
        page,
        limit,
        'Get all form order successfully',
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch form order');
    }
  }

  async findById(uuid: string): Promise<ApiResponse<any>> {
    try {
      const qb = this.repository
        .createQueryBuilder('fo')
        .select([
          'fo.uuid AS uuid',
          'fo.form_order_number AS form_order_number',
          'i.inventory_name AS part_name',
          'fo.quantity AS quantity',
          'fo.status AS status',
          'u.name AS "createdBy"',
          `TO_CHAR(fo."createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"`,
        ])
        .leftJoin(
          'inventory',
          'i',
          'i.id = fo.inventory_id AND i."deletedAt" IS NULL',
        )
        .leftJoin('users', 'u', 'u.id = fo."createdBy"')
        .where('fo."deletedAt" IS NULL')
        .andWhere('fo.uuid = :uuid', { uuid });

      const result = await qb.getRawOne();

      if (!result) {
        throwError('Form Order not found', 404);
      }

      return successResponse(result, 'Get form order detail successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get form order detail');
    }
  }

  async create(
    data: CreateFormOrderDto,
    userId: number,
  ): Promise<ApiResponse<ResponseDto>> {
    try {
      const existing = await this.repository.findOne({
        where: { form_order_number: data.form_order_number },
      });
      if (existing) {
        throwError(
          `Form Order Number ${data.form_order_number} already exists`,
          409,
        );
      }

      const newBody = this.repository.create({
        ...data,
        createdBy: userId,
      });

      const result = await this.repository.save(newBody);
      const response = plainToInstance(ResponseDto, result);

      return successResponse(
        response,
        'Create new form order successfully',
        201,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === '23505') {
        throwError('form order no already exists', 409);
      }
      throw new InternalServerErrorException('Failed to create form order');
    }
  }

  async update(
    uuid: string,
    updateDto: UpdateDto,
    userId: number,
  ): Promise<ApiResponse<FormOrder>> {
    try {
      const form_order = await this.repository.findOne({ where: { uuid } });
      if (!form_order) {
        throwError('Form Order not found', 404);
      }

      if (updateDto.form_order_number) {
        const existing = await this.repository.findOne({
          where: {
            form_order_number: updateDto.form_order_number,
            uuid: Not(uuid),
          },
        });
        if (existing) {
          throwError('Form Order No already in use by another Form', 409);
        }
      }

      const updatedData = {
        ...updateDto,
        status: updateDto.status as enumFormOrderStatus,
        createdBy: userId,
      };

      const updateFormOrder = this.repository.merge(form_order!, updatedData);
      const result = await this.repository.save(updateFormOrder);

      const response: any = {
        id: result.id,
        inventory_id: result.inventory_id,
        form_order_number: result.form_order_number,
        quantity: result.quantity,
        status: result.status,
      };

      return successResponse(response, 'Form Order updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Form Order');
    }
  }

  async remove(uuid: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const form_order = await this.repository.findOne({ where: { uuid } });

      if (!form_order) {
        throwError('Form Order not found', 404);
      }

      form_order!.deletedBy = userId;

      await this.repository.save(form_order!);
      await this.repository.softRemove(form_order!);

      return successResponse(null, 'Form Order deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete form order');
    }
  }
}
