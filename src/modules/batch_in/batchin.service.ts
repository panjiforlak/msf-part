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
  PostPDAQueueDto,
  CreatePDAStorageB2RDto,
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
          'bi."status_reloc" AS status',
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
      const superadmin = query.superadmin?.toLowerCase() ?? '';

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
        .leftJoin('storage_area', 'sa', 'i.racks_id = sa.id');

      if (superadmin !== 'yes') {
        qb.where('bi.picker_id = :pickerId', { pickerId: picker_id });
      } else {
        qb.where('1=1');
      }

      qb.andWhere('bi."deletedAt" IS NULL');
      qb.andWhere('bi."status" = true');

      if (search) {
        qb.andWhere('LOWER(bi.barcode) LIKE :search', {
          search: `%${search}%`,
        });
      }

      qb.orderBy('bi.id', 'ASC').offset(skip).limit(limit);

      const countQb = this.dataSource
        .createQueryBuilder()
        .from('batch_inbound', 'bi')
        .leftJoin('inventory', 'i', 'bi.inventory_id = i.id')
        .leftJoin('storage_area', 'sa', 'i.racks_id = sa.id');

      if (superadmin !== 'yes') {
        countQb.where('bi.picker_id = :pickerId', { pickerId: picker_id });
      } else {
        countQb.where('1=1');
      }

      countQb.andWhere('bi."deletedAt" IS NULL');

      if (search) {
        countQb.andWhere('LOWER(bi.barcode) LIKE :search', {
          search: `%${search}%`,
        });
      }

      const [result, total] = await Promise.all([
        qb.getRawMany(),
        countQb.getCount(),
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

  async findAllPDAQueue(
    picker_id: number,
    query: ParamsDto,
  ): Promise<ApiResponse<any>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;
      const search = query.search?.toLowerCase() ?? '';
      const superadmin = query.superadmin ?? 'no';
      const storage = query.storage?.toLowerCase() ?? '';

      const whereConditions: string[] = [];
      const params: any[] = [];

      let paramIndex = 1;

      // Filter berdasarkan picker_id kalau bukan superadmin
      if (superadmin !== 'yes') {
        whereConditions.push(`picker_id = $${paramIndex++}`);
        params.push(picker_id);
      }

      if (storage == 'b2r') {
        whereConditions.push(`storage_source IS NOT NULL`);
      }

      // Filter berdasarkan pencarian (search)
      if (search) {
        whereConditions.push(`LOWER(batch) LIKE $${paramIndex++}`);
        params.push(`%${search}%`);
      }

      const whereClause = whereConditions.length
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

      // Hitung total data
      const countQuery = `SELECT COUNT(*) FROM temp_inbound_queue ${whereClause}`;
      const countResult = await this.dataSource.query(countQuery, params);
      const total = parseInt(countResult[0].count, 10);

      // Ambil data dengan pagination
      const dataQuery = `
      SELECT *
      FROM temp_inbound_queue
      ${whereClause}
      ORDER BY id ASC
      OFFSET ${skip} LIMIT ${limit}
    `;
      const result = await this.dataSource.query(dataQuery, params);

      return paginateResponse(
        result,
        total,
        page,
        limit,
        'Get temp queue success',
      );
    } catch (error) {
      console.error('🔥 Error fetching PDA queue:', error);
      throw new InternalServerErrorException('Failed to fetch PDA queued data');
    }
  }

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
        relations: ['inventory'],
      });

      if (!result) {
        throwError('batch inbound not found', 404);
      }
      //destruct dari relasi inventory
      const { inventory_name } = result.inventory || {};

      const response: any = {
        id: result.id,
        barcode: result.barcode,
        inventory_id: result.inventory_id,
        inventory_name: inventory_name,
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

  async queuePDA(
    data: PostPDAQueueDto,
    userId: number,
  ): Promise<ApiResponse<any>> {
    try {
      await this.dataSource.transaction(async (manager) => {
        // 1. Buat temp table pakai raw SQL karena QueryBuilder tidak support CREATE TEMP TABLE
        await manager.query(`
        CREATE TABLE IF NOT EXISTS temp_inbound_queue (
          id SERIAL PRIMARY KEY,
          batch_in_id INT,
          batch VARCHAR(35),
          inventory_id INT DEFAULT 0,
          part_name VARCHAR(35),
          part_number VARCHAR(35),
          part_number_internal VARCHAR(35),
          quantity INT DEFAULT 0,
          rack_destination VARCHAR(35),
          barcode  VARCHAR(35),
          picker_id INT,
          "createdBy" INT,
          "createdAt" TIMESTAMP DEFAULT NOW()
        )
      `);

        // 2. Insert ke temp table dengan query builder
        await manager
          .createQueryBuilder()
          .insert()
          .into('temp_inbound_queue')
          .values({
            batch_in_id: data.batch_in_id,
            batch: data.batch,
            inventory_id: data.inventory_id,
            part_name: data.part_name,
            part_number: data.part_number,
            part_number_internal: data.part_number_internal,
            quantity: data.quantity,
            storage_source_id: data.storage_source_id,
            storage_source: data.storage_source,
            rack_destination: data.rack_destination,
            barcode: data.barcode,
            picker_id: data.picker_id,
            createdBy: userId,
          })
          .returning('*')
          .execute();

        // 3. Update batch_inbound status_reloc ke 'queue'
        // await manager
        //   .createQueryBuilder()
        //   .update('batch_inbound')
        //   .set({
        //     quantity: () => `quantity - ${data.quantity}`,
        //   })
        //   .where('id = :id', { id: data.batch_in_id })
        //   .execute();
        const tempRows = await manager.query(
          `SELECT * FROM temp_inbound_queue`,
        );
      });
      return successResponse(
        { data: data.barcode },
        'Scan queued successfully',
        201,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to execute transactional insert/update',
      );
    }
  }

  async createPDA(
    data: CreatePDABatchInDto,
    userId: number,
  ): Promise<ApiResponse<any>> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const storage = await manager
          .createQueryBuilder()
          .select(['sa.id', 'sa.storage_type', 'sa.barcode'])
          .from('storage_area', 'sa')
          .where('sa.barcode = :barcode', { barcode: data.storage_id })
          .andWhere('sa.deletedAt IS NULL')
          .getRawOne();

        if (!storage) {
          throwError(`Storage barcode ${data.storage_id} not found`, 400);
        }
        const storageId = storage.sa_id;

        let statusBox = true;

        if (storage.sa_storage_type?.toLowerCase() === 'box') {
          statusBox = false;
        }

        // 2. INSERT ke relocation inbound
        await manager
          .createQueryBuilder()
          .insert()
          .into('relocation')
          .values({
            batch_in_id: data.batch_in_id,
            reloc_from: 1,
            reloc_to: storageId,
            quantity: data.quantity,
            reloc_date: new Date(),
            reloc_type: 'inbound',
            reloc_status: statusBox,
            created_by: userId,
          })
          .execute();

        // 3. UPDATE inventory.quantity klo storage type == racks
        await manager
          .createQueryBuilder()
          .update('inventory')
          .set({
            quantity: () => `"quantity" + ${data.quantity}`,
            racks_id: storageId,
          })
          .where('id = :id', { id: data.inventory_id })
          .execute();

        //4.UPDATE queue if quantity masih ada di queue
        await manager
          .createQueryBuilder()
          .update('temp_inbound_queue')
          .set({
            quantity: () => `"quantity" - ${data.quantity}`,
          })
          .where('inventory_id = :inventory_id', {
            inventory_id: data.inventory_id,
          })
          .execute();

        //5. DELETE queue if quantity == 0
        const deleteResult = await manager
          .createQueryBuilder()
          .delete()
          .from('temp_inbound_queue')
          .where('inventory_id = :inventory_id', {
            inventory_id: data.inventory_id,
          })
          .andWhere('quantity <= 0')
          .execute();

        //6. check batch dengan item tersebut sudah di relocatio berapa?
        const checkQtyReloc = await manager
          .createQueryBuilder()
          .select('SUM(r.quantity)', 'total_quantity')
          .from('relocation', 'r')
          .where('r.batch_in_id = :batch_in_id', {
            batch_in_id: data.batch_in_id,
          })
          .getRawOne();

        //7. Jika delete berhasil dan baris dihapus
        if (deleteResult.affected && deleteResult.affected > 0) {
          await manager
            .createQueryBuilder()
            .update('batch_inbound')
            .set({
              status: false,
            })
            .where('id = :id', { id: data.batch_in_id })
            .andWhere('quantity = :quantity', {
              quantity: checkQtyReloc.total_quantity,
            })
            .execute();
        }

        // 8. UPDATE batch_inbound change status inbound to storage
        await manager
          .createQueryBuilder()
          .update('batch_inbound')
          .set({
            status_reloc: 'storage',
          })
          .where('id = :id', { id: data.batch_in_id })
          .execute();
      });

      return successResponse(
        null,
        'Insert batch + log + update inventory success',
        201,
      );
    } catch (error) {
      console.error('🔥 Error in createPDA:', error);
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

  // PDA Storage
  //find all inventory
  async findAllPDAB2r(
    picker_id: number,
    query: ParamsDto,
  ): Promise<ApiResponse<any>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const search = query.search?.toLowerCase() ?? '';
      const superadmin = query.superadmin?.toLowerCase() ?? '';

      const qb = this.dataSource
        .createQueryBuilder()
        .select([
          'r.batch_in_id AS batch_in_id',
          'r.uuid AS batch',
          'bi.inventory_id AS inventory_id',
          'i.inventory_name AS part_name',
          'i.inventory_code AS part_number',
          'i.inventory_internal_code AS part_number_internal',
          'r.quantity AS quantity',
          'r.reloc_to AS box_source_id',
          'sa2.storage_code AS box_source',
          'sa.storage_code AS rack_destination',
          'r.uuid AS barcode',
          `TO_CHAR(r."createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"`,
          'bi.picker_id AS picker_id',
        ])
        .from('relocation', 'r')
        .leftJoin('batch_inbound', 'bi', 'r.batch_in_id = bi.id')
        .leftJoin('inventory', 'i', 'bi.inventory_id = i.id')
        .leftJoin('storage_area', 'sa', 'i.racks_id = sa.id')
        .leftJoin('storage_area', 'sa2', 'r.reloc_to = sa2.id')
        .where('r.reloc_status = false');

      if (superadmin !== 'yes') {
        qb.andWhere('bi.picker_id = :pickerId', { pickerId: picker_id });
      }

      if (search) {
        qb.andWhere('LOWER(r.uuid) LIKE :search', {
          search: `%${search}%`,
        });
      }

      qb.orderBy('r.id', 'ASC').offset(skip).limit(limit);

      const countQb = this.dataSource
        .createQueryBuilder()
        .from('relocation', 'r')
        .leftJoin('batch_inbound', 'bi', 'r.batch_in_id = bi.id');

      countQb.where('r.reloc_status = false');
      if (superadmin !== 'yes') {
        countQb.andWhere('bi.picker_id = :pickerId', { pickerId: picker_id });
      }
      if (search) {
        countQb.andWhere('LOWER(r.uuid) LIKE :search', {
          search: `%${search}%`,
        });
      }

      const [result, total] = await Promise.all([
        qb.getRawMany(),
        countQb.getCount(),
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

  async createPDAb2r(
    data: CreatePDAStorageB2RDto,
    userId: number,
  ): Promise<ApiResponse<any>> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const storage = await manager
          .createQueryBuilder()
          .select(['sa.id', 'sa.storage_type', 'sa.barcode'])
          .from('storage_area', 'sa')
          .where('sa.barcode = :barcode', { barcode: data.storage_id })
          .andWhere('sa.deletedAt IS NULL')
          .getRawOne();

        if (!storage) {
          throwError(`Storage barcode ${data.storage_id} not found`, 400);
        }

        const storageId = storage.sa_id;

        // 2. INSERT ke relocation storage
        await manager
          .createQueryBuilder()
          .insert()
          .into('relocation')
          .values({
            batch_in_id: data.batch_in_id,
            reloc_from: data.storage_source_id,
            reloc_to: storageId,
            quantity: data.quantity,
            reloc_date: new Date(),
            reloc_type: 'box-to-rack',
            reloc_status: true,
            created_by: userId,
          })
          .execute();

        await manager
          .createQueryBuilder()
          .update('temp_inbound_queue')
          .set({
            quantity: () => `"quantity" - ${data.quantity}`,
          })
          .where('inventory_id = :inventory_id', {
            inventory_id: data.inventory_id,
          })
          .andWhere('storage_source_id=:storage_source_id', {
            storage_source_id: data.storage_source_id,
          })
          .execute();

        // Delete temp
        await manager
          .createQueryBuilder()
          .delete()
          .from('temp_inbound_queue')
          .where('inventory_id = :inventory_id', {
            inventory_id: data.inventory_id,
          })
          .andWhere('storage_source_id=:storage_source_id', {
            storage_source_id: data.storage_source_id,
          })
          .andWhere('quantity <= 0')
          .execute();

        // 4. UPDATE batch_inbound change status inbound to storage
        await manager
          .createQueryBuilder()
          .update('batch_inbound')
          .set({
            status_reloc: 'storage',
          })
          .where('id = :id', { id: data.batch_in_id })
          .execute();
      });

      return successResponse(
        null,
        'Insert batch + log + update inventory success',
        201,
      );
    } catch (error) {
      console.error('🔥 Error in createPDA:', error);
      throw new InternalServerErrorException(
        'Failed to execute transactional insert/update',
      );
    }
  }

  async findAllPDAR2r(
    picker_id: number,
    query: ParamsDto,
  ): Promise<ApiResponse<any>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;
      const search = query.search?.toLowerCase() ?? '';
      const superadmin = query.superadmin?.toLowerCase() ?? '';

      const subQuery = this.dataSource
        .createQueryBuilder()
        .select([
          'inner_r.batch_in_id AS batch_in_id',
          'inner_r.reloc_to AS reloc_to',
        ])
        .from((qb) => {
          return qb
            .select([
              'r.batch_in_id AS batch_in_id',
              'r.reloc_to AS reloc_to',
              `ROW_NUMBER() OVER (
              PARTITION BY r.batch_in_id
              ORDER BY 
                CASE WHEN r.reloc_type = 'rack-to-rack' THEN 1 ELSE 2 END,
                r."createdAt" DESC
            ) AS row_num`,
            ])
            .from('relocation', 'r')
            .where(`r.reloc_type IN ('rack-to-rack', 'inbound')`)
            .andWhere(`r."deletedAt" IS NULL`);
        }, 'inner_r')
        .where('inner_r.row_num = 1');

      // Main querynya -___-
      const qb = this.dataSource
        .createQueryBuilder()
        .select([
          'bi.id AS batch_in_id',
          'bi.barcode AS batch',
          'i.id AS inventory_id',
          'i.inventory_name AS part_name',
          'i.inventory_code AS part_number',
          'i.inventory_internal_code AS part_number_internal',
          'i.quantity AS quantity',
          `(i.quantity - COALESCE((
              SELECT SUM(r2.quantity)
              FROM relocation r2
              WHERE r2.batch_in_id = bi.id
                AND r2.reloc_type = 'inbound'
                AND r2.reloc_status = false
            ), 0)) AS quantity`,
          'reloc_final.reloc_to AS rack_source_id',
          'sa2.storage_code AS rack_source',
          'sa.storage_code AS rack_destination',
          'bi.barcode AS barcode',
          `TO_CHAR(bi."createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"`,
          'bi.picker_id AS picker_id',
        ])
        .from('inventory', 'i')
        .leftJoin(
          'batch_inbound',
          'bi',
          'i.id = bi.inventory_id AND bi."deletedAt" IS NULL',
        )
        .leftJoin(
          'storage_area',
          'sa',
          'i.racks_id = sa.id AND sa."deletedAt" IS NULL',
        )
        .leftJoin(
          `(${subQuery.getQuery()})`,
          'reloc_final',
          'reloc_final.batch_in_id = bi.id',
        )
        .leftJoin(
          'storage_area',
          'sa2',
          'reloc_final.reloc_to = sa2.id AND sa2."deletedAt" IS NULL',
        )
        .where('i."deletedAt" IS NULL')
        .setParameters(subQuery.getParameters());

      if (superadmin !== 'yes') {
        qb.andWhere('bi.picker_id = :pickerId', { pickerId: picker_id });
      }

      if (search) {
        qb.andWhere('LOWER(bi.barcode) LIKE :search', {
          search: `%${search}%`,
        });
      }

      qb.orderBy('bi.id', 'ASC').offset(skip).limit(limit);

      const countQb = this.dataSource
        .createQueryBuilder()
        .from('batch_inbound', 'bi')
        .leftJoin(
          'inventory',
          'i',
          'bi.inventory_id = i.id AND i."deletedAt" IS NULL',
        )
        .where('bi."deletedAt" IS NULL');

      if (superadmin !== 'yes') {
        countQb.andWhere('bi.picker_id = :pickerId', { pickerId: picker_id });
      }

      if (search) {
        countQb.andWhere('LOWER(bi.barcode) LIKE :search', {
          search: `%${search}%`,
        });
      }

      const [result, total] = await Promise.all([
        qb.getRawMany(),
        countQb.getCount(),
      ]);

      return paginateResponse(
        result,
        total,
        page,
        limit,
        'Get all PDA R2R successfully',
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to fetch PDA R2R data');
    }
  }

  async createPDAR2r(
    data: CreatePDAStorageB2RDto,
    userId: number,
  ): Promise<ApiResponse<any>> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const storage = await manager
          .createQueryBuilder()
          .select(['sa.id', 'sa.storage_type', 'sa.barcode'])
          .from('storage_area', 'sa')
          .where('sa.barcode = :barcode', { barcode: data.storage_id })
          .andWhere('sa.deletedAt IS NULL')
          .getRawOne();

        if (!storage) {
          throwError(`Storage barcode ${data.storage_id} not found`, 400);
        }

        const storageId = storage.sa_id;

        // 2. INSERT ke relocation
        await manager
          .createQueryBuilder()
          .insert()
          .into('relocation')
          .values({
            batch_in_id: data.batch_in_id,
            reloc_from: data.storage_source_id,
            reloc_to: storageId,
            quantity: data.quantity,
            reloc_date: new Date(),
            reloc_type: 'rack-to-rack',
            reloc_status: true,
            created_by: userId,
          })
          .execute();

        // update quantity di queue
        await manager
          .createQueryBuilder()
          .update('temp_inbound_queue')
          .set({
            quantity: () => `"quantity" - ${data.quantity}`,
          })
          .where('inventory_id = :inventory_id', {
            inventory_id: data.inventory_id,
          })
          .andWhere('storage_source_id=:storage_source_id', {
            storage_source_id: data.storage_source_id,
          })
          .execute();

        // Delete queue jika qty 0
        await manager
          .createQueryBuilder()
          .delete()
          .from('temp_inbound_queue')
          .where('inventory_id = :inventory_id', {
            inventory_id: data.inventory_id,
          })
          .andWhere('storage_source_id=:storage_source_id', {
            storage_source_id: data.storage_source_id,
          })
          .andWhere('quantity <= 0')
          .execute();

        // 4. UPDATE batch_inbound change status inbound to storage
        await manager
          .createQueryBuilder()
          .update('batch_inbound')
          .set({
            status_reloc: 'storage',
          })
          .where('id = :id', { id: data.batch_in_id })
          .execute();
      });

      return successResponse(
        null,
        'Insert batch + log + update inventory success',
        201,
      );
    } catch (error) {
      console.error('🔥 Error in createPDA:', error);
      throw new InternalServerErrorException(
        'Failed to execute transactional insert/update',
      );
    }
  }
}
