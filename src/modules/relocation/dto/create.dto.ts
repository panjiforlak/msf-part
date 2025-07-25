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

export class CreateDto {
  @ApiProperty()
  @IsNumber()
  inventory_id: number;

  @ApiProperty()
  @IsNumber()
  batch_in_id: number;

  @ApiProperty()
  @IsNumber()
  reloc_from: number;

  @ApiProperty()
  @IsNumber()
  reloc_to: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: String, format: 'date-time' })
  @Type(() => Date)
  @IsDate()
  reloc_date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  updatedBy?: number;
}
