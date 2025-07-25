import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { batchin_type } from '../entities/batchin.entity';

export class CreateDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  updatedBy?: number;
}
