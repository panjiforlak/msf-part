import { Expose, Exclude, Type } from 'class-transformer';
import { IsOptional, IsNumberString } from 'class-validator';
import { JoinColumn, ManyToOne } from 'typeorm';

export class GetVehicleQueryDto {
  @Expose()
  id: number;

  @Expose()
  vin_number: string;

  @Expose()
  vehicle_number: string;

  @Expose()
  brand: string;

  @Expose()
  type: string;

  @Expose()
  capacity_ton: string;

  @Expose()
  status: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date | null;
}

export class QueryParamDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  search?: string;
}

export class CreateVehiclesDto {
  vin_number: string;
  vehicle_number: string;
  brand: string;
  type: string;
  capacity_ton: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export class ReturnResponseDto {
  id: number;
  vin_number: string;
  vehicle_number?: string;
  brand?: string;
  type?: string;
  capacity_ton?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  meta?: any;
}
