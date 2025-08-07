import { Expose, Exclude, Type } from 'class-transformer';
import {
  IsOptional,
  IsNumberString,
  IsString,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoinColumn, ManyToOne } from 'typeorm';

export class GetVehicleQueryDto {
  @ApiProperty({ description: 'Vehicle ID', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Vehicle Identification Number',
    example: 'VIN123456789',
  })
  @Expose()
  vin_number: string;

  @ApiProperty({
    description: 'Vehicle registration number',
    example: 'B1234ABC',
  })
  @Expose()
  vehicle_number: string;

  @ApiProperty({ description: 'Vehicle brand', example: 'Toyota' })
  @Expose()
  brand: string;

  @ApiProperty({ description: 'Vehicle type', example: 'Truck' })
  @Expose()
  type: string;

  @ApiProperty({ description: 'Vehicle capacity in tons', example: '5' })
  @Expose()
  capacity_ton: string;

  @ApiProperty({
    description: 'Vehicle status',
    example: 'active',
    enum: ['active', 'inactive', 'maintenance'],
  })
  @Expose()
  status: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date | null;
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
    description: 'Search term for VIN number or vehicle number',
    example: 'VIN123',
    type: String,
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateVehiclesDto {
  @ApiProperty({
    description: 'Vehicle Identification Number (VIN)',
    example: 'VIN123456789',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  vin_number: string;

  @ApiProperty({
    description: 'Vehicle registration number',
    example: 'B1234ABC',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  vehicle_number: string;

  @ApiProperty({
    description: 'Vehicle brand',
    example: 'Toyota',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({
    description: 'Vehicle type',
    example: 'Truck',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Vehicle capacity in tons',
    example: '5',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  capacity_ton: string;

  @ApiProperty({
    description: 'Vehicle status',
    example: 'active',
    enum: ['active', 'inactive', 'maintenance'],
    type: String,
  })
  @IsNotEmpty()
  @IsEnum(['active', 'inactive', 'maintenance'])
  status: string;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date | null;
}

export class ReturnResponseDto {
  @ApiProperty({ description: 'Vehicle ID', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Vehicle Identification Number',
    example: 'VIN123456789',
  })
  vin_number: string;

  @ApiPropertyOptional({
    description: 'Vehicle registration number',
    example: 'B1234ABC',
  })
  vehicle_number?: string;

  @ApiPropertyOptional({ description: 'Vehicle brand', example: 'Toyota' })
  brand?: string;

  @ApiPropertyOptional({ description: 'Vehicle type', example: 'Truck' })
  type?: string;

  @ApiPropertyOptional({
    description: 'Vehicle capacity in tons',
    example: '5',
  })
  capacity_ton?: string;

  @ApiPropertyOptional({ description: 'Vehicle status', example: 'active' })
  status?: string;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date | null;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  meta?: any;
}
