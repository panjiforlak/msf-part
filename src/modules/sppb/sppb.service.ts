import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sppb } from './entities/sppb.entity';
import { OrderForm } from '../work_order/entities/order_form.entity';
import { Users } from '../users/entities/users.entity';
import { SppbListResponseDto } from './dto/response.dto';
import { SppbListQueryDto } from './dto/query.dto';
import {
  ApiResponse as ApiResponseType,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';

@Injectable()
export class SppbService {
  constructor(
    @InjectRepository(Sppb)
    private readonly sppbRepository: Repository<Sppb>,
    @InjectRepository(OrderForm)
    private readonly orderFormRepository: Repository<OrderForm>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getSppbList(
    query: SppbListQueryDto,
  ): Promise<ApiResponseType<SppbListResponseDto[]>> {
    try {
      const page = parseInt(query.page?.toString() ?? '1', 10);
      const limit = parseInt(query.limit?.toString() ?? '10', 10);
      const skip = (page - 1) * limit;

      const queryBuilder = this.sppbRepository
        .createQueryBuilder('sppb')
        .leftJoin('order_form', 'of', 'of.id = sppb.order_form_id')
        .leftJoin('users', 'author_user', 'author_user.id = sppb.author')
        .leftJoin('users', 'picker_user', 'picker_user.id = of.picker_id')
        .select([
          'sppb.id as sppb_id',
          'sppb.sppb_number as sppb_number',
          'sppb.createdAt as sppb_date',
          'of.departement as department_name',
          'author_user.name as author',
          'picker_user.name as picker',
          'sppb.start_date as start_date',
          'sppb.end_date as end_date',
        ])
        .where('sppb.deletedAt IS NULL');

      // Filter berdasarkan bulan
      if (query.month) {
        // Filter berdasarkan start_date jika ada, jika tidak gunakan createdAt sebagai fallback
        queryBuilder.andWhere(
          'EXTRACT(MONTH FROM COALESCE(sppb.start_date, sppb.createdAt)) = :month',
          {
            month: query.month,
          },
        );
      }

      // Filter berdasarkan keyword
      if (query.keyword) {
        queryBuilder.andWhere(
          '(sppb.sppb_number ILIKE :keyword OR of.departement ILIKE :keyword OR author_user.name ILIKE :keyword OR picker_user.name ILIKE :keyword)',
          { keyword: `%${query.keyword}%` },
        );
      }

      // Hitung total data tanpa pagination
      const totalQueryBuilder = queryBuilder.clone();
      const total = await totalQueryBuilder.getCount();

      // Tambahkan pagination
      queryBuilder.orderBy('sppb.id', 'DESC').offset(skip).limit(limit);

      const sppbList = await queryBuilder.getRawMany();

      const transformedData = sppbList.map((item) => ({
        sppb_id: item.sppb_id,
        sppb_number: item.sppb_number,
        sppb_date: item.sppb_date,
        department_name: item.department_name || '',
        author: item.author || '',
        picker: item.picker || '',
        start_date: item.start_date,
        end_date: item.end_date,
      }));

      return paginateResponse(
        transformedData,
        total,
        page,
        limit,
        'Get SPPB list successfully',
      );
    } catch (error) {
      throwError('Failed to fetch SPPB list', 500);
    }
  }
} 