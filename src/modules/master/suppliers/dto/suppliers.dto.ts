import { Expose, Exclude, Type } from 'class-transformer';
import {
  IsOptional,
  IsNumberString,
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoinColumn, ManyToOne } from 'typeorm';

export class GetSuppliersQueryDto {
  @ApiProperty({ description: 'Supplier ID', example: 1 })
  @Expose()
  id: number;

  @ApiPropertyOptional({ description: 'Supplier UUID', example: 'uuid-12345' })
  @Expose()
  uuid?: string;

  @ApiPropertyOptional({ description: 'Item ID', example: 1 })
  @Expose()
  item_id?: number;

  @ApiPropertyOptional({
    description: 'Supplier name',
    example: 'PT Supplier ABC',
  })
  @Expose()
  supplier_name?: string;

  @ApiPropertyOptional({
    description: 'Supplier address',
    example: 'Jl. Supplier No. 123',
  })
  @Expose()
  supplier_address?: string;

  @ApiPropertyOptional({
    description: 'Remarks',
    example: 'Preferred supplier',
  })
  @Expose()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Created by user ID', example: 1 })
  @Expose()
  createdBy?: number;

  @Exclude()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Updated by user ID', example: 1 })
  @Expose()
  updatedBy?: number;

  @Exclude()
  updatedAt?: Date | null;

  @ApiPropertyOptional({ description: 'Deleted by user ID', example: 1 })
  @Expose()
  deletedBy?: number;

  @Exclude()
  deletedAt?: Date | null;
}

export class QueryParamDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: '1',
    type: String,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: '10',
    type: String,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Search term for supplier name',
    example: 'ABC',
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateSuppliersDto {
  @ApiProperty({
    description: 'Supplier name',
    example: 'PT Supplier ABC',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  supplier_name: string;

  @ApiPropertyOptional({
    description: 'Supplier address',
    example: 'Jl. Supplier No. 123',
    type: String,
  })
  @IsOptional()
  @IsString()
  supplier_address?: string;

  @ApiPropertyOptional({
    description: 'Item ID',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  item_id?: number;

  @ApiPropertyOptional({
    description: 'Remarks',
    example: 'Preferred supplier',
    type: String,
  })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Created by user ID', example: 1 })
  createdBy?: number;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Updated by user ID', example: 1 })
  updatedBy?: number;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date | null;

  @ApiPropertyOptional({ description: 'Deleted by user ID', example: 1 })
  deletedBy?: number;

  @ApiPropertyOptional({ description: 'Deletion timestamp' })
  deletedAt?: Date | null;
}

export class ReturnResponseDto {
  @ApiProperty({ description: 'Supplier ID', example: 1 })
  id: number;

  @ApiPropertyOptional({ description: 'Supplier UUID', example: 'uuid-12345' })
  uuid?: string;

  @ApiPropertyOptional({
    description: 'Supplier name',
    example: 'PT Supplier ABC',
  })
  supplier_name?: string;

  @ApiPropertyOptional({
    description: 'Supplier address',
    example: 'Jl. Supplier No. 123',
  })
  supplier_address?: string;

  @ApiPropertyOptional({ description: 'Item ID', example: 1 })
  item_id?: number;

  @ApiPropertyOptional({
    description: 'Remarks',
    example: 'Preferred supplier',
  })
  remarks?: string;

  @ApiPropertyOptional({ description: 'Created by user ID', example: 1 })
  createdBy?: number;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Updated by user ID', example: 1 })
  updatedBy?: number;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date | null;

  @ApiPropertyOptional({ description: 'Deleted by user ID', example: 1 })
  deletedBy?: number;

  @ApiPropertyOptional({ description: 'Deletion timestamp' })
  deletedAt?: Date | null;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  meta?: any;
}
