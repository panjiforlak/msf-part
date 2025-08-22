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
import {
  DashboardTrendDaily,
  DashboardTrendMonthly,
  DashboardTrendAnnualy,
} from './entities/tren.entity';
import { el } from '@faker-js/faker/.';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async dashboardCount(
    query: ParamsDto,
  ): Promise<ApiResponse<ResponseCountDto[]>> {
    try {
      const qb = this.dataSource
        .getRepository(DashboardCount)
        .createQueryBuilder('kpi');

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

  async dashboardTren(
    query: ParamsDto,
  ): Promise<ApiResponse<ResponseCountDto[]>> {
    try {
      const periode_type = query.periode_type?.toLowerCase() ?? '';
      let result: any = [];

      if (periode_type === 'daily') {
        result = await this.getTrendDaily();
      } else if (periode_type === 'monthly') {
        result = await this.getTrendMonthly();
      } else if (periode_type === 'annualy') {
        result = await this.getTrendAnnualy();
      } else {
        throwError('Invalid periode_type', 400);
      }
      return successResponse(result);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch batch inbound');
    }
  }

  // private
  private async getTrendDaily() {
    const rawData = await this.dataSource
      .getRepository(DashboardTrendDaily)
      .createQueryBuilder('d')
      .select([
        'd.inventory_name AS spareparts',
        'd.dmy AS dmy',
        'd.total_cost AS cost',
      ])
      .orderBy('d.dmy', 'ASC')
      .getRawMany();

    const data = rawData.map((row) => ({
      spareparts: row.spareparts,
      dmy:
        row.dmy instanceof Date ? row.dmy.toISOString().split('T')[0] : row.dmy,
      cost: parseFloat(row.cost),
    }));

    const total = data.reduce((acc, row) => acc + row.cost, 0);

    return {
      periode_type: 'daily',
      tren: data,
      total,
    };
  }

  private async getTrendMonthly() {
    const rawData = await this.dataSource
      .getRepository(DashboardTrendMonthly)
      .createQueryBuilder('m')
      .select([
        'm.inventory_name AS spareparts',
        'm.dmy AS dmy',
        'm.total_cost AS cost',
      ])
      .orderBy('m.dmy', 'ASC')
      .getRawMany();

    const data = rawData.map((row) => ({
      spareparts: row.spareparts,
      dmy:
        row.dmy instanceof Date ? row.dmy.toISOString().split('T')[0] : row.dmy,
      cost: parseFloat(row.cost),
    }));

    const total = data.reduce((acc, row) => acc + row.cost, 0);

    return {
      periode_type: 'monthly',
      tren: data,
      total,
    };
  }

  private async getTrendAnnualy() {
    const rawData = await this.dataSource
      .getRepository(DashboardTrendAnnualy)
      .createQueryBuilder('y')
      .select([
        'y.inventory_name AS spareparts',
        'y.dmy AS dmy',
        'y.total_cost AS cost',
      ])
      .orderBy('y.dmy', 'ASC')
      .getRawMany();

    const data = rawData.map((row) => ({
      spareparts: row.spareparts,
      dmy:
        row.dmy instanceof Date
          ? row.dmy.toISOString().split('T')[0]
          : row.dmy.toString(),
      cost: parseFloat(row.cost),
    }));

    const total = data.reduce((acc, row) => acc + row.cost, 0);

    return {
      periode_type: 'annualy',
      tren: data,
      total,
    };
  }
}
