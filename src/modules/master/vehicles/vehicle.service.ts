import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from './entities/vehicle.entity';
import { ILike, Not, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../../common/helpers/response.helper';
import { paginateResponse } from '../../../common/helpers/public.helper';
import * as bcrypt from 'bcrypt';
import {
  GetVehicleQueryDto,
  QueryParamDto,
  CreateVehiclesDto,
  ReturnResponseDto,
} from './dto/vehicle.dto';
import { plainToInstance } from 'class-transformer';
import { title } from 'process';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
  ) {}

  async findByVin(
    vin_number: string,
    vehicle_number: string,
  ): Promise<Vehicles | null> {
    return this.vehicleRepository.findOne({
      where: [{ vin_number }, { vehicle_number }],
      withDeleted: false,
    });
  }

  async findAll(
    query: QueryParamDto,
  ): Promise<ApiResponse<GetVehicleQueryDto[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.vehicleRepository.findAndCount({
        where: query.search
          ? [
              { vin_number: ILike(`%${query.search}%`) },
              { vehicle_number: ILike(`%${query.search}%`) },
            ]
          : {},
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });

      const transformedResult = plainToInstance(Vehicles, result, {
        excludeExtraneousValues: true,
      });

      return paginateResponse(
        transformedResult,
        total,
        page,
        limit,
        'Get all vehicle susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch vehicles');
    }
  }

  async findById(id: number): Promise<ApiResponse<any>> {
    try {
      const result: any = await this.vehicleRepository.findOne({
        where: { id },
      });

      if (!result) {
        throwError('Vehicle not found', 404);
      }

      if (result.status !== 'active') {
        throwError('Vehicle has been deleted', 404);
      }

      const response: any = {
        id: result.id,
        vin_number: result.vin_number,
        vehicle_number: result.vehicle_number,
        brand: result.brand,
        type: result.type,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get vehicle');
    }
  }

  async create(
    data: CreateVehiclesDto,
  ): Promise<ApiResponse<ReturnResponseDto>> {
    try {
      const existing = await this.findByVin(
        data.vin_number,
        data.vehicle_number,
      );
      if (existing) {
        throwError(
          `Vin Number ${existing.vin_number} or vehicle Number ${existing.vehicle_number} already exists`,
          409,
        );
      }

      const newVehicle = this.vehicleRepository.create(data);
      const result = await this.vehicleRepository.save(newVehicle);
      const response: ReturnResponseDto = {
        id: result.id,
        vin_number: result.vin_number,
        vehicle_number: result.vehicle_number,
        brand: result.brand,
        type: result.type,
      };

      return successResponse(response, 'Create new vehicles successfully', 201);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create vehicles');
    }
  }

  async update(
    id: number,
    updateDto: CreateVehiclesDto,
  ): Promise<ApiResponse<Vehicles>> {
    try {
      const vehicles = await this.vehicleRepository.findOne({ where: { id } });
      if (!vehicles) {
        throwError('Vehicles not found', 404);
      }
      if (updateDto.vin_number) {
        const existingVin = await this.vehicleRepository.findOne({
          where: {
            vin_number: updateDto.vin_number,
            id: Not(id),
          },
        });
        if (existingVin) {
          throwError('VIN number already in use by another vehicle', 409);
        }
      }

      const updatedVehicles = this.vehicleRepository.merge(
        vehicles!,
        updateDto,
      );
      const result = await this.vehicleRepository.save(updatedVehicles);
      const response: any = {
        id: result.id,
        vin_number: result.vin_number,
        vehicle_number: result.vehicle_number,
        brand: result.brand,
        type: result.type,
      };
      return successResponse(response, 'Vehicles updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Vehicles');
    }
  }

  async remove(id: number, userId: number): Promise<ApiResponse<null>> {
    try {
      const vehicles = await this.vehicleRepository.findOne({
        where: { id },
      });

      if (!vehicles) {
        throwError('vehicles not found', 404);
      }

      vehicles!.deletedBy = userId;

      await this.vehicleRepository.save(vehicles!);
      await this.vehicleRepository.softRemove(vehicles!);

      return successResponse(null, 'vehicles deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete vehicles');
    }
  }
}
