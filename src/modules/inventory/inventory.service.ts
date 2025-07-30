import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { CreateInventoryDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';
import { ItemsSpnumLog } from './entities/items_spnum_log.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private repository: Repository<Inventory>,
    @InjectRepository(ItemsSpnumLog)
    private readonly spnumLogRepository: Repository<ItemsSpnumLog>,
    private readonly dataSource: DataSource,
  ) {}

  async findByItemNumberInternal(
    inventory_internal_code: string,
  ): Promise<Inventory | null> {
    return this.repository.findOne({
      where: [{ inventory_internal_code }],
      withDeleted: false,
    });
  }
  async findAll(query: ParamsDto): Promise<ApiResponse<any>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;
      const search = query.search?.toLowerCase() ?? '';

      const qb = this.dataSource
        .createQueryBuilder()
        .select([
          'i.id AS id',
          'i.uuid AS uuid',
          'c.inventory_type AS inventory_type',
          'i.inventory_code AS part_number',
          'i.inventory_internal_code AS part_number_internal',
          'i.inventory_name AS inventory_name',
          'c.component_name AS component_name',
          'i.racks_id AS racks_id',
          'sa.storage_code AS racks_name',
          // 'COALESCE(SUM(DISTINCT ri.quantity), 0) AS qty_in',
          'COALESCE(SUM(CASE WHEN ri.quantity >= 0 THEN ri.quantity ELSE 0 END), 0) AS qty_in',
          'COALESCE(SUM(CASE WHEN ri.quantity < 0 THEN ri.quantity ELSE 0 END), 0) AS qty_out',
          // 'COALESCE(SUM(DISTINCT ro.quantity), 0) AS qty_out',
          'i.quantity AS qty_on_hand',
        ])
        .from('inventory', 'i')
        .leftJoin('components', 'c', 'i.component_id = c.id')

        // INBOUND
        .leftJoin('batch_inbound', 'bi', 'i.id = bi.inventory_id')
        .leftJoin('detail_inventory_storage', 'ri', 'bi.id = ri.batch_in_id ')
        .leftJoin('storage_area', 'sa', 'i.racks_id = sa.id');

      // // OUTBOUND
      // .leftJoin('batch_outbound', 'bo', 'i.id = bo.inventory_id')
      // .leftJoin('detail_inventory_storage', 'ro', 'bo.id = ro.batch_in_id ')
      // .where('i."deletedAt" IS NULL');

      if (search) {
        qb.andWhere('LOWER(i.inventory_name) LIKE :search', {
          search: `%${search}%`,
        });
      }

      qb.groupBy('i.id')
        .addGroupBy('c.inventory_type')
        .addGroupBy('i.inventory_code')
        .addGroupBy('i.inventory_internal_code')
        .addGroupBy('i.inventory_name')
        .addGroupBy('i.racks_id')
        .addGroupBy('c.component_name')
        .addGroupBy('sa.storage_code')
        .addGroupBy('i.quantity')
        .orderBy('i.id', 'DESC')
        .offset(skip)
        .limit(limit);

      const result = await qb.getRawMany();

      // hitung total data tanpa pagination
      const countQb = this.dataSource
        .createQueryBuilder()
        .select('COUNT(*)', 'total')
        .from((subQb) => {
          return (
            subQb
              .select('i.id', 'id')
              .from('inventory', 'i')
              .leftJoin('components', 'c', 'i.component_id = c.id')

              // INBOUND
              .leftJoin('batch_inbound', 'bi', 'i.id = bi.inventory_id')
              .leftJoin(
                'detail_inventory_storage',
                'ri',
                'bi.id = ri.batch_in_id',
              )
              .leftJoin('storage_area', 'sa', 'i.racks_id = sa.id')
              // // OUTBOUND
              // .leftJoin('batch_outbound', 'bo', 'i.id = bo.inventory_id')
              // .leftJoin(
              //   'detail_inventory_storage',
              //   'ro',
              //   'bo.id = ro.batch_in_id ',
              // )

              .where('i."deletedAt" IS NULL')
              .andWhere(
                search ? 'LOWER(i.inventory_name) LIKE :search' : 'TRUE',
                { search: `%${search}%` },
              )
              .groupBy(
                'i.id, c.inventory_type, i.inventory_code, i.inventory_internal_code, i.inventory_name, c.component_name,i.racks_id,sa.storage_code, i.quantity',
              )
          );
        }, 'sub');

      const countResult = await countQb.getRawOne();
      const total = parseInt(countResult?.total ?? '0', 10);
      const parsed = result.map((item) => ({
        ...item,
        qty_in: Number(item.qty_in),
        qty_out: Number(item.qty_out),
        qty_on_hand: Number(item.qty_on_hand),
      }));
      return paginateResponse(
        parsed,
        total,
        page,
        limit,
        'Get all inventory successfully',
      );
    } catch (error) {
      console.error('[InventoryService][findAll] Error:', error);
      throw new InternalServerErrorException('Failed to fetch inventory');
    }
  }
  //tidak jadi menggunakan ini
  // async findAlls(query: ParamsDto): Promise<ApiResponse<Inventory[]>> {
  //   try {
  //     const page = parseInt(query.page ?? '1', 10);
  //     const limit = parseInt(query.limit ?? '10', 10);
  //     const skip = (page - 1) * limit;

  //     const [result, total] = await this.repository.findAndCount({
  //       where: query.search
  //         ? [{ inventory_name: ILike(`%${query.search}%`) }]
  //         : {},
  //       withDeleted: false,
  //       order: {
  //         id: 'DESC',
  //       },
  //       skip,
  //       take: limit,
  //       // relations: ['components'],
  //     });

  //     // const mergedResult = result.map((inventory) => {
  //     //   const {
  //     //     components: { inventory_type, component_name } = {}, // fallback default empty object
  //     //     ...inventoryData
  //     //   } = inventory;

  //     //   return {
  //     //     ...inventoryData,
  //     //     inventory_type,
  //     //     component_name,
  //     //   };
  //     // });
  //     return paginateResponse(
  //       result,
  //       total,
  //       page,
  //       limit,
  //       'Get all inventory susccessfuly',
  //     );
  //   } catch (error) {
  //     if (error instanceof HttpException) throw error;
  //     throw new InternalServerErrorException('Failed to fetch inventory');
  //   }
  // }

  async findById(slug: string): Promise<ApiResponse<any>> {
    try {
      const result = await this.repository
        .createQueryBuilder('i')
        .leftJoin('components', 'c', 'c.id = i.component_id') // ← pakai nama tabel dan field eksplisit
        .leftJoin('storage_area', 'sa', 'sa.id = i.racks_id')
        .leftJoin('batch_inbound', 'bi', 'bi.inventory_id = i.id')
        .leftJoin(
          'relocation',
          'ri',
          'ri.batch_in_id = bi.id AND ri.reloc_to != 0',
        )
        .leftJoin('batch_outbound', 'bo', 'bo.inventory_id = i.id')
        .leftJoin(
          'reloc_outbound',
          'ro',
          'ro.batch_in_id = bo.id AND ro.reloc_to != 0',
        )

        .select([
          'i.id AS id',
          'i.inventory_name AS inventory_name',
          'i.inventory_code AS part_number',
          'i.inventory_internal_code AS part_number_internal',
          'i.uom AS uom',
          'i.remarks AS remarks',
          'c.inventory_type AS inventory_type',
          'i.component_id AS component_id',
          'c.component_name AS component_name',
          'CAST(COALESCE(SUM(ri.quantity), 0) AS INTEGER) AS qty_in',
          'CAST(COALESCE(SUM(ro.quantity), 0) AS INTEGER) AS qty_out',
          'i.quantity AS qty_onhand',
          'i.racks_id AS racks_id',
          'sa.storage_code AS racks_name',
        ])
        .addSelect((subQuery) => {
          return subQuery
            .select(
              `COALESCE(json_agg(json_build_object(
              'id', b.id, 
              'arrival_date', b.arrival_date,
              'batch_number', b.barcode,
              'quantity', b.quantity,
              'batch_number', b.barcode
              ) ORDER BY b.id), '[]')`,
            )
            .from('batch_inbound', 'b')
            .where('b.inventory_id = i.id');
        }, 'batch_inbound_list') // alias
        .addSelect((subQuery) => {
          return subQuery
            .select(
              `COALESCE(json_agg(json_build_object(
              'id', isl.id,
              'date', TO_CHAR(isl.updatedAt, 'YYYY-MM-DD HH24:MI:SS'),
              'part_number_old',isl.inventory_code_old,
              'part_number_new',isl.inventory_code_new,
              'changer_name', usr.name
              ) ORDER BY isl.id), '[]')`,
            )
            .from('items_spnum_log', 'isl')
            .leftJoin('users', 'usr', 'isl.updatedBy=usr.id')
            .where('isl.item_id = i.id');
        }, 'logs_change_part_no') // alias
        .where('i.uuid = :uuid', { uuid: slug })
        .andWhere('i."deletedAt" IS NULL')
        .groupBy('i.id')
        .addGroupBy('i.inventory_name')
        .addGroupBy('i.inventory_code')
        .addGroupBy('i.inventory_internal_code')
        .addGroupBy('i.uom')
        .addGroupBy('i.remarks')
        .addGroupBy('i.component_id')
        .addGroupBy('c.inventory_type')
        .addGroupBy('c.component_name')
        .addGroupBy('i.quantity')
        .addGroupBy('i.racks_id')
        .addGroupBy('sa.storage_code')
        .getRawOne();

      if (!result) {
        throwError('Inventory not found', 404);
      }

      return successResponse(result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error.stack);
      throw new InternalServerErrorException('Failed to get inventory');
    }
  }

  async create(
    data: CreateInventoryDto,
    userId: number,
  ): Promise<ApiResponse<ResponseDto>> {
    try {
      const existing = await this.findByItemNumberInternal(
        data.inventory_internal_code ?? '',
      );
      if (existing) {
        throwError(
          `Item Number ${data.inventory_internal_code} already exists`,
          409,
        );
      }

      const newBody = this.repository.create({
        ...data,
        createdBy: userId,
      });

      const result = await this.repository.save(newBody);
      const response = plainToInstance(ResponseDto, result);

      return successResponse(response, 'Create new items successfully', 201);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create items');
    }
  }

  async update(
    uuid: string,
    updateDto: UpdateDto,
    userId: number,
  ): Promise<ApiResponse<Inventory>> {
    try {
      const items = await this.repository.findOne({
        where: { uuid },
      });
      // log untuk perubahan item_number shacman atau item number internal
      const isItemNumberChanged =
        items?.inventory_code !== updateDto.inventory_code;

      if (isItemNumberChanged) {
        const log = this.spnumLogRepository.create({
          item_id: items?.id,
          inventory_code_old: items?.inventory_code,
          inventory_code_new: updateDto.inventory_code,
          updatedBy: userId,
        });

        await this.spnumLogRepository.save(log);
      }

      if (!items) {
        throwError('Items not found', 404);
      }
      if (updateDto.inventory_internal_code) {
        const existingCheck = await this.repository.findOne({
          where: {
            inventory_internal_code: updateDto.inventory_internal_code,
            uuid: Not(uuid),
          },
        });
        if (existingCheck) {
          throwError('Item name already in use by another Items', 409);
        }
      }

      const updatedBody = this.repository.merge(items!, updateDto, {
        updatedBy: userId,
      });

      const result = await this.repository.save(updatedBody);

      const response: any = {
        id: result.id,
        uuid: result.uuid,
        inventory_code: result.inventory_code,
        inventory_code_internal: result.inventory_internal_code,
        inventory_name: result.inventory_name,
        weight: result.weight,
      };
      return successResponse(response, 'inventory updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update inventory');
    }
  }

  async remove(uuid: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const items = await this.repository.findOne({
        where: { uuid },
      });

      if (!items) {
        throwError('items not found', 404);
      }

      items!.deletedBy = userId;

      await this.repository.save(items!);
      await this.repository.softRemove(items!);

      return successResponse(null, 'items deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete items');
    }
  }
}
