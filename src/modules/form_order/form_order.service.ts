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
import { paginateResponse, unslug } from '../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { CreateFormOrderDetailDto, CreateFormOrderDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';
import { DataSource } from 'typeorm';
import { FormOrderDetail } from './entities/formOrderDetail.entity';

@Injectable()
export class FormOrderService {
  constructor(
    @InjectRepository(FormOrder)
    private repository: Repository<FormOrder>,
    @InjectRepository(FormOrderDetail)
    private repositoryDetail: Repository<FormOrderDetail>,
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
          'fo.form_order_number AS form_order_number',
          'fo.status AS status',
          `COALESCE(u2.name, '') AS approved_spv`,
          `COALESCE(u3.name, '') AS approved_pjo`,
          'fo.remarks AS "remarks"',
          'u.name AS "createdBy"',
          `TO_CHAR(u."createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"`,
        ])
        .leftJoin('users', 'u', 'u.id = fo."createdBy"')
        .leftJoin('users', 'u2', 'u2.id = fo.approved_spv')
        .leftJoin('users', 'u3', 'u3.id = fo.approved_pjo')
        .where('fo."deletedAt" IS NULL')
        .andWhere('fo.form_order_number ILIKE :search', {
          search: `%${search}%`,
        });

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
        .leftJoin('users', 'u', 'u.id = fo."createdBy"')
        .where('fo."deletedAt" IS NULL')
        .andWhere('( fo.form_order_number ILIKE :search)', {
          search: `%${search}%`,
        });

      const countResult = await countQb.getRawOne();
      const total = parseInt(countResult?.total ?? '0', 10);
      const parsed = result.map((item) => ({
        ...item,
        status: unslug(item.status),
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

  async findById(fo_no: string): Promise<ApiResponse<any>> {
    try {
      const qb = this.repository
        .createQueryBuilder('fo')
        .select([
          'fo.uuid AS uuid',
          'fo.form_order_number AS form_order_number',
          'fo.remarks AS remarks',
          'fo.status AS status',
          `COALESCE(u2.name, '') AS approved_spv`,
          `COALESCE(u3.name, '') AS approved_pjo`,
          'u.name AS "createdBy"',
          `TO_CHAR(fo."createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"`,
        ])
        // ambil array detail
        .addSelect(
          `
        COALESCE(
          json_agg(
            json_build_object(
              'id', rfo.id,
              'uuid', i.uuid,
              'inventory_id', rfo.inventory_id,
              'part_name', i.inventory_name,
              'uom', i.uom,
              'quantity', rfo.quantity,
              'on_hand', i.quantity
            )
          ) FILTER (WHERE rfo.id IS NOT NULL), '[]'
        ) AS details
      `,
        )
        .leftJoin(
          'r_form_order_detail',
          'rfo',
          'rfo.fo_id = fo.id AND rfo."deletedAt" IS NULL',
        )
        .leftJoin(
          'inventory',
          'i',
          'i.id = rfo.inventory_id AND i."deletedAt" IS NULL',
        )
        .leftJoin('users', 'u', 'u.id = fo."createdBy"')
        .leftJoin('users', 'u2', 'u2.id = fo.approved_spv')
        .leftJoin('users', 'u3', 'u3.id = fo.approved_pjo')
        .where('fo."deletedAt" IS NULL')
        .andWhere('fo.form_order_number = :fo_no', { fo_no })
        .groupBy('fo.id, u.name, u2.name, u3.name');

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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const today = new Date();
      const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, '');
      const lastOrder = await queryRunner.manager
        .getRepository(FormOrder)
        .createQueryBuilder('fo')
        .where('fo.form_order_number LIKE :prefix', {
          prefix: `FO-${yyyymmdd}-%`,
        })
        .orderBy('fo.form_order_number', 'DESC')
        .getOne();

      let nextSeq = 1;
      if (lastOrder) {
        const parts = lastOrder.form_order_number.split('-'); // sekarang pake '-'
        const lastSeq = parseInt(parts[2], 10);
        nextSeq = lastSeq + 1;
      }
      const newFoNumber = formatFormOrderNumber(today, nextSeq);

      // cek exist......
      const existing = await queryRunner.manager
        .getRepository(FormOrder)
        .createQueryBuilder('hfo')
        .where('hfo.form_order_number = :form_order_number', {
          form_order_number: newFoNumber,
        })
        .andWhere('hfo.deletedAt IS NULL')
        .getOne();

      if (existing) {
        throwError(`Form Order No ${newFoNumber} already exists`, 409);
      }

      // h_form_order
      const formOrder = queryRunner.manager.create(FormOrder, {
        form_order_number: newFoNumber,
        remarks: data.remarks,
        status: data.status ?? enumFormOrderStatus.WAITSPV,
        createdBy: userId,
      });

      const savedFormOrder = await queryRunner.manager.save(
        FormOrder,
        formOrder,
      );

      // r_form_order_detail
      if (Array.isArray(data.fo_details) && data.fo_details.length > 0) {
        const details = data.fo_details.map((d) =>
          queryRunner.manager.create(FormOrderDetail, {
            fo_id: savedFormOrder.id,
            inventory_id: d.inventory_id,
            quantity: d.quantity,
            createdBy: userId,
          }),
        );

        await queryRunner.manager.save(FormOrderDetail, details);
      }

      await queryRunner.commitTransaction();

      const response = plainToInstance(ResponseDto, savedFormOrder);
      return successResponse(
        response,
        'Create new form order successfully',
        201,
      );
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error.stack);

      throw new InternalServerErrorException('Failed to create form order');
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    fo_no: string,
    updateDto: UpdateDto,
    userId: number,
    roleCode: string,
  ): Promise<ApiResponse<FormOrder>> {
    try {
      const form_order = await this.repository.findOne({
        where: { form_order_number: fo_no },
      });
      if (!form_order) {
        throwError('Form Order not found', 404);
      }

      if (updateDto.form_order_number) {
        const existing = await this.repository.findOne({
          where: {
            form_order_number: Not(fo_no),
          },
        });
        if (existing) {
          throwError('Form Order No already in use by another Form', 409);
        }
      }

      let updatedData: any = {
        ...updateDto,
        status: updateDto.status as enumFormOrderStatus,
        createdBy: userId,
      };

      // Handle status changes for SPV
      if (
        updateDto.status &&
        updateDto.status === enumFormOrderStatus.WAITPJO
      ) {
        if (roleCode.toLowerCase() !== 'SPVWH'.toLowerCase()) {
          throwError('Only SPV can approve this order', 403);
        }
        updatedData = {
          ...updatedData,
          approved_spv: userId,
          approved_date_spv: new Date(),
        };
      }
      // Handle status changes for PJO
      if (
        updateDto.status &&
        updateDto.status === enumFormOrderStatus.FINISHED
      ) {
        if (roleCode.toLowerCase() !== 'PJO'.toLowerCase()) {
          throwError('Only PJO can approve this order', 403);
        }
        updatedData = {
          ...updatedData,
          approved_pjo: userId,
          approved_date_pjo: new Date(),
        };
      }
      console.log('updatedData', updatedData);
      const updateFormOrder = this.repository.merge(form_order!, updatedData);
      const result = await this.repository.save(updateFormOrder);

      const response: any = {
        id: result.id,
        form_order_number: result.form_order_number,
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

  async updateInv(
    fo_no: string,
    inv_id: number,
    updateDto: CreateFormOrderDetailDto,
    userId: number,
  ): Promise<ApiResponse<FormOrder>> {
    try {
      const form_order = await this.repository.findOne({
        where: { form_order_number: fo_no },
      });
      if (!form_order) {
        throwError('Form Order not found', 404);
      }

      const form_order_detail = await this.repositoryDetail.findOne({
        where: { fo_id: form_order?.id, id: inv_id },
      });

      if (!form_order_detail) {
        throwError('Detail inventory not found', 404);
      }

      const updatedData = {
        ...updateDto,
        createdBy: userId,
      };

      const updateFormOrder = this.repositoryDetail.merge(
        form_order_detail!,
        updatedData,
      );
      const result = await this.repositoryDetail.save(updateFormOrder);

      const response: any = {
        id: result.id,
      };

      return successResponse(response, 'Form Order updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Form Order');
    }
  }

  async remove(fo_no: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const form_order = await this.repository.findOne({
        where: { form_order_number: fo_no },
      });

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

function padNumber(num: number, size = 4): string {
  return num.toString().padStart(size, '0');
}

function formatFormOrderNumber(date: Date, seq: number): string {
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, ''); // 20250819
  return `FO-${yyyymmdd}-${padNumber(seq, 4)}`;
}
