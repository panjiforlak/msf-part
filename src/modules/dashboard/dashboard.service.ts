import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { ParamsDto } from './dto/param.dto';
import { ResponseCountDto } from './dto/resCount.dto';
import { DashboardCount } from './entities/count.entity';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async findAll(query: ParamsDto): Promise<ApiResponse<ResponseCountDto[]>> {
    try {
      const qb = this.dataSource
        .getRepository(DashboardCount)
        .createQueryBuilder('kpi');

      // karena view return cuma 1 row → pakai getRawOne()
      const result = await qb
        .select([
          'kpi.total_inventory AS total_inventory',
          'kpi.total_stock_in AS total_stock_in',
          'kpi.total_stock_out As total_stock_out',
          'kpi.total_completed_wo AS total_completed_wo',
          'kpi.total_completed_fo As total_completed_fo',
          'kpi.total_rack As total_rack',
        ])
        .getRawOne();

      return successResponse(result);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch batch inbound');
    }
  }
}
