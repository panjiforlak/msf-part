import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude, Type } from 'class-transformer';
import { IsOptional, IsNumberString, IsEnum } from 'class-validator';
import { JoinColumn, ManyToOne } from 'typeorm';
import { wa_status, wa_type } from '../entities/workingarea.entity';

export class GetSuppliersQueryDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  uuid?: string;

  @ApiProperty()
  @Expose()
  item_id?: number;

  @ApiProperty()
  @Expose()
  supplier_name?: string;

  @ApiProperty()
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

export class CreateDto {
  working_area_code?: string;
  @IsEnum(wa_type)
  working_area_type?: wa_type;
  working_area_availability?: boolean;
  @IsEnum(wa_status)
  working_area_status?: wa_status;
  barcode?: number;
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
  working_area_code?: string;
  @IsEnum(wa_type)
  working_area_type?: wa_type;
  working_area_availability?: boolean;
  @IsEnum(wa_status)
  working_area_status?: wa_status;
  barcode?: number;
  remarks?: string;
  createdBy?: number;
  createdAt?: Date;
  updatedBy?: number;
  updatedAt?: Date | null;
  deletedBy?: number;
  deletedAt?: Date | null;
  meta?: any;
}
