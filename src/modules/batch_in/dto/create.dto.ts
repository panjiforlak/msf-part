import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { batchin_type } from '../entities/batchin.entity';

export class CreateBatchInDto {
  @ApiProperty()
  @IsNumber()
  inventory_id: number;

  @ApiProperty()
  @IsNumber()
  doc_ship_id: number;

  @ApiProperty()
  @IsNumber()
  supplier_id: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  picker_id: number;

  @ApiProperty({ type: String, format: 'date-time' })
  @Type(() => Date)
  @IsDate()
  arrival_date: Date;

  @ApiPropertyOptional({ enum: batchin_type })
  @IsOptional()
  @IsEnum(batchin_type)
  status_reloc?: batchin_type;

  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @IsOptional()
  @IsNumber()
  updatedBy?: number;
}

export enum StorageTypeEnum {
  RACKS = 'racks',
  BOX = 'box',
}

export class CreatePDABatchInDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  batch_in_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storage_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  inventory_id: number;

  @ApiProperty()
  @IsEnum(StorageTypeEnum)
  @IsNotEmpty()
  @IsOptional()
  storage_type: StorageTypeEnum;
}
export class CreatePDAStorageB2RDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  batch_in_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  storage_source_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  storage_source: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storage_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  inventory_id: number;

  @ApiProperty()
  @IsEnum(StorageTypeEnum)
  @IsNotEmpty()
  @IsOptional()
  storage_type: StorageTypeEnum;
}
export class PostPDAQueueDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  batch_in_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  batch: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  inventory_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  part_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  part_number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  part_number_internal: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  storage_source_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  storage_source?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rack_destination: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  barcode: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  picker_id: number;

  @IsOptional()
  @IsNumber()
  createdBy?: number;
}
