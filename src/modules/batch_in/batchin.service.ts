import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchInbound } from './entities/batchin.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import {
  CreateBatchInDto,
  CreatePDABatchInDto,
  StorageTypeEnum,
} from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class BatchInboundService {
  constructor(
    @InjectRepository(BatchInbound)
    private repository: Repository<BatchInbound>,
    private readonly dataSource: DataSource,
  ) {}

  async findByDocNo(barcode: string): Promise<BatchInbound | null> {
    return this.repository.findOne({
      where: [{ barcode }],
      withDeleted: false,
    });
  }

  async findAll(query: ParamsDto): Promise<ApiResponse<BatchInbound[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const search = query.search?.toLowerCase() ?? '';

      const qb = this.dataSource
        .createQueryBuilder()
        .select([
          'bi.id AS batch_in_id',
          'bi.barcode AS batch',
          `TO_CHAR(bi."arrival_date", 'YYYY-MM-DD HH24:MI') AS "arrival_date"`,
          'bi.price AS price',
          'ds.uuid AS doc_ship',
          'bi.inventory_id AS inventory_id',
          'i.inventory_name AS part_name',
          'bi.quantity AS quantity',
          'bi.barcode AS barcode',
          'bi.lifetime AS lifetime',
          'bi.picker_id AS picker_id',
          'u.name AS picker_name',
          `TO_CHAR(bi."createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"`,
          'bi."picker_id" AS picker_id',
        ])
        .from('batch_inbound', 'bi')
        .leftJoin('inventory', 'i', 'bi.inventory_id = i.id')
        .leftJoin('doc_shipping', 'ds', 'bi.doc_ship_id = ds.id')
        .leftJoin('users', 'u', 'bi.picker_id = u.id')
        .where('bi."deletedAt" IS NULL');

      if (search) {
        qb.andWhere(
          `(LOWER(bi.barcode) LIKE :search OR CAST(ds.uuid AS TEXT) ILIKE :search)`,
          { search: `%${search}%` },
        );
      }

      qb.orderBy('bi.id', 'DESC').offset(skip).limit(limit);

      const [result, total] = await Promise.all([
        qb.getRawMany(),
        this.dataSource
          .createQueryBuilder()
          .from('batch_inbound', 'bi')
          .leftJoin('doc_shipping', 'ds', 'bi.doc_ship_id = ds.id')
          .where('bi."deletedAt" IS NULL')
          .andWhere(
            search
              ? `(LOWER(bi.barcode) LIKE :search OR CAST(ds.uuid AS TEXT) ILIKE :search)`
              : 'TRUE',
            search ? { search: `%${search}%` } : {},
          )
          .getCount(),
      ]);

      return paginateResponse(
        result,
        total,
        page,
        limit,
        'Get all batch inbound successfully',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log(error.stack);
      throw new InternalServerErrorException('Failed to fetch batch inbound');
    }
  }

  async findAllPDA(
    picker_id: number,
    query: ParamsDto,
  ): Promise<ApiResponse<any>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const search = query.search?.toLowerCase() ?? '';

      const qb = this.dataSource
        .createQueryBuilder()
        .select([
          'bi.id AS batch_in_id',
          'bi.barcode AS batch',
          'bi.inventory_id AS inventory_id',
          'i.inventory_name AS part_name',
          'i.inventory_code AS part_number',
          'i.inventory_internal_code AS part_number_internal',
          'bi.quantity AS quantity',
          'sa.storage_code AS rack_destination',
          'bi.barcode AS barcode',
          `TO_CHAR(bi."createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"`,
          'bi."picker_id" AS picker_id',
        ])
        .from('batch_inbound', 'bi')
        .leftJoin('inventory', 'i', 'bi.inventory_id = i.id')
        .leftJoin('storage_area', 'sa', 'i.racks_id = sa.id')
        .where('bi.picker_id = :pickerId', { pickerId: picker_id })
        .andWhere('bi."deletedAt" IS NULL');

      // searchnya neeeehhh broh
      if (search) {
        qb.andWhere('LOWER(bi.barcode) LIKE :search', {
          search: `%${search}%`,
        });
      }

      qb.orderBy('bi.id', 'ASC').offset(skip).limit(limit);

      const [result, total] = await Promise.all([
        qb.getRawMany(),
        this.dataSource
          .createQueryBuilder()
          .from('batch_inbound', 'bi')
          .where('bi.picker_id = :pickerId', { pickerId: picker_id })
          .andWhere('bi."deletedAt" IS NULL')
          .andWhere(
            search ? 'LOWER(bi.barcode) LIKE :search' : 'TRUE',
            search ? { search: `%${search}%` } : {},
          )
          .getCount(),
      ]);

      return paginateResponse(
        result,
        total,
        page,
        limit,
        'Get all batch inbound successfully',
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch batch inbound');
    }
  }

  //for api calling
  async findById(id: number): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { id },
      });

      if (!result) {
        throwError('Batch inbound not found', 404);
      }

      const response: any = {
        id: result.id,
        barcode: result.barcode,
        inventory_id: result.inventory_id,
        doc_ship_id: result.doc_ship_id,
        supplier_id: result.supplier_id,
        quantity: result.quantity,
        price: result.price,
        arrival_date: result.arrival_date,
        status_reloc: result.status_reloc,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get batch inbound');
    }
  }

  async findBySlug(slug: string): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { barcode: slug },
      });

      if (!result) {
        throwError('batch inbound not found', 404);
      }

      const response: any = {
        id: result.id,
        barcode: result.barcode,
        inventory_id: result.inventory_id,
        doc_ship_id: result.doc_ship_id,
        supplier_id: result.supplier_id,
        quantity: result.quantity,
        price: result.price,
        arrival_date: result.arrival_date,
        status_reloc: result.status_reloc,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get batch inbound');
    }
  }

  async create(
    data: CreateBatchInDto,
    userId: number,
  ): Promise<ApiResponse<ResponseDto>> {
    try {
      const newBody = this.repository.create({
        ...data,
        createdBy: userId,
      });

      const result = await this.repository.save(newBody);
      const response = plainToInstance(ResponseDto, result);

      return successResponse(
        response,
        'Create new batch inbound successfully',
        201,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create batch inbound');
    }
  }

  async createMany(
    data: CreateBatchInDto[],
    userId: number,
  ): Promise<ApiResponse<ResponseDto[]>> {
    try {
      const newRecords = data.map((item) =>
        this.repository.create({
          ...item,
          createdBy: userId,
        }),
      );

      const result = await this.repository.save(newRecords);
      const response = plainToInstance(ResponseDto, result);

      return successResponse(
        response,
        'Create batch inbound(s) successfully',
        201,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create batch inbound');
    }
  }

  async createPDA(
    data: CreatePDABatchInDto,
    userId: number,
  ): Promise<ApiResponse<any>> {
    try {
      await this.dataSource.transaction(async (manager) => {
        // 1. INSERT ke inventory detail storage
        const insertResult = await manager
          .createQueryBuilder()
          .insert()
          .into('detail_inventory_storage')
          .values({
            batch_in_id: data.batch_in_id,
            storage_id: data.storage_id,
            quantity: data.quantity,
            createdBy: userId, // picker
          })
          .execute();

        // 2. INSERT ke relocation inbound
        await manager
          .createQueryBuilder()
          .insert()
          .into('reloc_inbound')
          .values({
            batch_in_id: data.batch_in_id,
            reloc_from: 1, // 1 = inbound
            reloc_to: data.storage_id,
            quantity: data.quantity,
            reloc_date: new Date(),
            created_by: userId, // picker
          })
          .execute();

        // 3. UPDATE inventory.quantity klo storage type == racks
        await manager
          .createQueryBuilder()
          .update('inventory')
          .set({
            quantity: () => `"quantity" + ${data.quantity}`,
            racks_id: data.storage_id,
          })
          .where('id = :id', { id: data.inventory_id })
          .execute();
      });

      return successResponse(
        null,
        'Insert batch + log + update inventory success',
        201,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to execute transactional insert/update',
      );
    }
  }

  async update(
    barcode: string,
    updateDto: UpdateDto,
    userId: number,
  ): Promise<ApiResponse<BatchInbound>> {
    try {
      const params = await this.repository.findOne({
        where: { barcode },
      });

      if (!params) {
        throwError('Batch Inbound not found', 404);
      }

      const updatedBody = this.repository.merge(params!, updateDto, {
        updatedBy: userId,
      });

      const result = await this.repository.save(updatedBody);

      const response: any = {
        id: result.id,
      };
      return successResponse(response, 'Batch Inbound updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Doc Batch');
    }
  }

  async remove(barcode: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const items = await this.repository.findOne({
        where: { barcode },
      });

      if (!items) {
        throwError('Batch inbound not found', 404);
      }

      items!.deletedBy = userId;

      await this.repository.save(items!);
      await this.repository.softRemove(items!);

      return successResponse(null, 'Batch inbound deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error.stack);
      throw new InternalServerErrorException('Failed to delete batch inbound');
    }
  }
}
