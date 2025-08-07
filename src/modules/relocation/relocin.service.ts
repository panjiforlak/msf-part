import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelocInbound } from './entities/relocin.entity';
import { DataSource, ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { CreateRelocInDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ResponseDto } from './dto/response.dto';
import { ParamsDto } from './dto/param.dto';

@Injectable()
export class RelocInboundService {
  constructor(
    @InjectRepository(RelocInbound)
    private repository: Repository<RelocInbound>,
    private dataSource: DataSource,
  ) {}

  async findByDocNo(uuid: string): Promise<RelocInbound | null> {
    return this.repository.findOne({
      where: [{ uuid }],
      withDeleted: false,
    });
  }

  async findAll(query: ParamsDto): Promise<ApiResponse<RelocInbound[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.repository.findAndCount({
        where: query.search ? [{ uuid: ILike(`%${query.search}%`) }] : {},
        withDeleted: false,
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
        relations: ['batch_in'],
      });
      return paginateResponse(
        result,
        total,
        page,
        limit,
        'Get all Relocation Inbound susccessfuly',
      );
    } catch (error) {
      console.log(error.stack);
      if (error instanceof HttpException) throw error;
      return throwError('Failed to fetch Relocation Inbound', 500);
    }
  }

  async findAllRelocationInbound(query: ParamsDto): Promise<ApiResponse<any>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;
      const search = query.search?.toLowerCase() ?? '';
      const type = query.type;

      const qb = this.dataSource
        .createQueryBuilder()
        .select([
          'r.id AS id',
          'r.reloc_type AS type',
          "TO_CHAR(r.reloc_date, 'DD/MM/YYYY') AS date",
          'i.inventory_name AS part_name',
          'i.inventory_internal_code AS part_internal_code',
          'r.quantity AS quantity',
          'i.uom AS uom',
          'u.name AS picker',
          'sa.storage_code AS source',
          'sa2.storage_code AS destination',
        ])
        .from('relocation', 'r')
        .leftJoin('batch_inbound', 'bi', 'r.batch_in_id = bi.id')
        .leftJoin('inventory', 'i', 'bi.inventory_id = i.id')
        .leftJoin('users', 'u', 'r.picker_id = u.id')
        .leftJoin('storage_area', 'sa', 'r.reloc_from = sa.id')
        .leftJoin('storage_area', 'sa2', 'r.reloc_to = sa2.id')
        .where('r."deletedAt" IS NULL')
        .andWhere(`r.reloc_type != 'outbound'`);

      if (search) {
        qb.andWhere('LOWER(i.inventory_name) LIKE :search', {
          search: `%${search}%`,
        });
      }

      if (type) {
        qb.andWhere('r.reloc_type = :type', { type });
      }

      qb.orderBy('r.reloc_type', 'DESC').offset(skip).limit(limit);

      const result = await qb.getRawMany();

      // Count total data tanpa pagination
      const countQb = this.dataSource
        .createQueryBuilder()
        .select('COUNT(*)', 'total')
        .from((subQb) => {
          let sub = subQb
            .select('r.id', 'id')
            .from('relocation', 'r')
            .leftJoin('batch_inbound', 'bi', 'r.batch_in_id = bi.id')
            .leftJoin('inventory', 'i', 'bi.inventory_id = i.id')
            .leftJoin('users', 'u', 'r.picker_id = u.id')
            .leftJoin('storage_area', 'sa', 'r.reloc_from = sa.id')
            .leftJoin('storage_area', 'sa2', 'r.reloc_to = sa2.id')
            .where('r."deletedAt" IS NULL')
            .andWhere(`r.reloc_type != 'outbound'`);

          if (search) {
            sub = sub.andWhere('LOWER(i.inventory_name) LIKE :search', {
              search: `%${search}%`,
            });
          }

          if (type) {
            sub = sub.andWhere('r.reloc_type = :type', { type });
          }

          return sub;
        }, 'sub')
        .setParameters({ search: `%${search}%`, type });

      const countResult = await countQb.getRawOne();
      const total = parseInt(countResult?.total ?? '0', 10);

      return paginateResponse(
        result,
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

  async findAllPDA(
    picker_id: number,
    query: ParamsDto,
  ): Promise<ApiResponse<RelocInbound[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.repository.findAndCount({
        where: query.search ? [{ uuid: ILike(`%${query.search}%`) }] : {},
        withDeleted: false,
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });

      return paginateResponse(
        result,
        total,
        page,
        limit,
        'Get all relocation inbound susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      return throwError('Failed to fetch relocation inbound', 500);
    }
  }

  async findById(uuid: string): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.repository.findOne({
        where: { uuid: uuid },
      });

      if (!result) {
        return throwError('relocation inbound Area not found', 404);
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
      return throwError('Failed to get relocation inbound', 500);
    }
  }

  async create(
    data: CreateRelocInDto,
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
        'Create new relocation inbound successfully',
        200,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return throwError('Failed to create relocation inbound', 500);
    }
  }

  async createMany(
    data: CreateRelocInDto[],
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
        200,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return throwError('Failed to create batch inbound', 500);
    }
  }

  async update(
    uuid: string,
    updateDto: UpdateDto,
    userId: number,
  ): Promise<ApiResponse<RelocInbound>> {
    try {
      const params = await this.repository.findOne({
        where: { uuid },
      });

      if (!params) {
        return throwError('Batch Inbound not found', 404);
      }

      const updatedBody = this.repository.merge(params, updateDto, {
        updatedBy: userId,
      });

      const result = await this.repository.save(updatedBody);

      const response: any = {
        id: result.id,
        reloc_from: result.reloc_from,
        reloc_to: result.reloc_to,
      };
      return successResponse(response, 'Batch Inbound updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error.stack);
      return throwError('Failed to update Doc Batch', 500);
    }
  }

  async remove(uuid: string, userId: number): Promise<ApiResponse<null>> {
    try {
      const items = await this.repository.findOne({
        where: { uuid },
      });

      if (!items) {
        return throwError('Batch inbound not found', 404);
      }

      items.deletedBy = userId;

      await this.repository.save(items);
      await this.repository.softRemove(items);

      return successResponse(null, 'Batch inbound deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error.stack);
      return throwError('Failed to delete batch inbound', 500);
    }
  }
}
