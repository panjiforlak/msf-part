import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sppb } from './entities/sppb.entity';
import { OrderForm } from '../work_order/entities/order_form.entity';
import { Users } from '../users/entities/users.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { BatchOutbound } from '../work_order/entities/batch_outbound.entity';
import { Storagearea } from '../master/storage/entities/storagearea.entity';
import { S3Service } from '../../integrations/s3/s3.service';
import { SppbListResponseDto, SppbDetailResponseDto } from './dto/response.dto';
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
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(BatchOutbound)
    private readonly batchOutboundRepository: Repository<BatchOutbound>,
    @InjectRepository(Storagearea)
    private readonly storageareaRepository: Repository<Storagearea>,
    private readonly s3Service: S3Service,
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
          'of.start_date as start_date',
          'sppb.end_date as end_date',
        ])
        .where('sppb.deletedAt IS NULL');

      // Filter berdasarkan bulan
      if (query.month) {
        // Filter berdasarkan start_date dari order_form jika ada, jika tidak gunakan createdAt sebagai fallback
        queryBuilder.andWhere(
          'EXTRACT(MONTH FROM COALESCE(of.start_date, sppb.createdAt)) = :month',
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
      return throwError('Failed to fetch SPPB list', 500);
    }
  }

  async getSppbDetail(
    id: number,
  ): Promise<ApiResponseType<SppbDetailResponseDto>> {
    try {
      // Query untuk mendapatkan detail SPPB
      const sppbDetail = await this.sppbRepository
        .createQueryBuilder('sppb')
        .leftJoin('order_form', 'of', 'of.id = sppb.order_form_id')
        .leftJoin('users', 'author_user', 'author_user.id = sppb.author')
        .leftJoin('users', 'picker_user', 'picker_user.id = of.picker_id')
        .select([
          'sppb.id as sppb_id',
          'sppb.sppb_number as sppb_number',
          'sppb.mechanic_photo as mechanic_photo',
          'sppb.status as status',
          'author_user.name as author',
          'picker_user.name as picker',
          'of.departement as department',
          'of.start_date as start_date',
          'sppb.end_date as end_date',
        ])
        .where('sppb.id = :id', { id })
        .andWhere('sppb.deletedAt IS NULL')
        .getRawOne();

      if (!sppbDetail) {
        return throwError('SPPB not found', 404);
      }

      // Query untuk mendapatkan sparepart list
      const sparepartList = await this.batchOutboundRepository
        .createQueryBuilder('bo')
        .leftJoin('order_form', 'of', 'of.id = bo.order_form_id')
        .leftJoin('inventory', 'inv', 'inv.id = bo.inventory_id')
        .leftJoin('storage_area', 'sa', 'sa.id = inv.racks_id')
        .select([
          'bo.inventory_id as inventory_id',
          'of.start_date as tanggal',
          'inv.inventory_internal_code as part_number',
          'inv.inventory_name as part_name',
          'bo.quantity as quantity',
          'inv.uom as uom',
          'sa.storage_code as rack',
        ])
        .innerJoin('sppb', 'sppb', 'sppb.order_form_id = of.id')
        .where('sppb.id = :id', { id })
        .andWhere('sppb.deletedAt IS NULL')
        .andWhere('of.deletedAt IS NULL')
        .andWhere('inv.deletedAt IS NULL')
        .andWhere('bo.deletedAt IS NULL')
        .getRawMany();

      const transformedSparepartList = sparepartList.map((item) => ({
        inventory_id: item.inventory_id,
        tanggal: item.tanggal,
        part_number: item.part_number || '',
        part_name: item.part_name || '',
        quantity: item.quantity || 0,
        uom: item.uom || '',
        rack: item.rack || '',
      }));

      const result: SppbDetailResponseDto = {
        sppb_id: sppbDetail.sppb_id,
        sppb_number: sppbDetail.sppb_number,
        mechanic_photo: sppbDetail.mechanic_photo,
        status: sppbDetail.status,
        author: sppbDetail.author || '',
        picker: sppbDetail.picker || '',
        department: sppbDetail.department || '',
        start_date: sppbDetail.start_date,
        end_date: sppbDetail.end_date,
        sparepart_list: transformedSparepartList,
      };

      return successResponse(result, 'Get SPPB detail successfully');
    } catch (error) {
      return throwError('Failed to fetch SPPB detail', 500);
    }
  }

  async uploadMechanicPhoto(
    sppbId: number,
    file: Express.Multer.File,
    userId: number,
  ): Promise<ApiResponseType<{ mechanic_photo: string }>> {
    try {
      // Cek apakah SPPB exists
      const sppb = await this.sppbRepository.findOne({
        where: { id: sppbId },
      });

      if (!sppb) {
        return throwError('SPPB not found', 404);
      }

      // Upload file ke S3
      const uploaded = await this.s3Service.uploadFile(
        file,
        'sppb-mechanic-photos',
      );

      // Update SPPB dengan foto baru
      await this.sppbRepository.update(
        { id: sppbId },
        {
          mechanic_photo: uploaded.url,
          updatedBy: userId,
        },
      );

      return successResponse(
        { mechanic_photo: uploaded.url },
        'Mechanic photo uploaded successfully',
      );
    } catch (error) {
      return throwError('Failed to upload mechanic photo', 500);
    }
  }
} 