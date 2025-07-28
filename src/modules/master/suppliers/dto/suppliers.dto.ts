import { Expose, Exclude, Type } from 'class-transformer';
import { IsOptional, IsNumberString } from 'class-validator';
import { JoinColumn, ManyToOne } from 'typeorm';

export class GetSuppliersQueryDto {
  @Expose()
  id: number;

  @Expose()
  uuid?: string;

  @Expose()
  item_id?: number;

  @Expose()
  supplier_name?: string;

  @Expose()
  remarks?: string;

  @Expose()
  createdBy?: number;

  @Exclude()
  createdAt: Date;

  @Expose()
  updatedBy?: number;

  @Exclude()
  updatedAt?: Date | null;

  @Expose()
  deletedBy?: number;

  @Exclude()
  deletedAt?: Date | null;
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

export class CreateSuppliersDto {
  supplier_name: string;
  supplier_address?: string;
  item_id?: number;
  remarks?: string;
  createdBy?: number;
  createdAt?: Date;
  updatedBy?: number;
  updatedAt?: Date | null;
  deletedBy?: number;
  deletedAt?: Date | null;
}

export class ReturnResponseDto {
  id: number;
  uuid?: string;
  supplier_name?: string;
  supplier_address?: string;
  item_id?: number;
  remarks?: string;
  createdBy?: number;
  createdAt?: Date;
  updatedBy?: number;
  updatedAt?: Date | null;
  deletedBy?: number;
  deletedAt?: Date | null;
  meta?: any;
}
