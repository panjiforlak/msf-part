import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { enumFormOrderStatus } from '../entities/formOrder.entity';

export class CreateFormOrderDto {
  @IsNumber()
  @IsNotEmpty()
  inventory_id?: number;

  @IsString()
  @IsNotEmpty()
  form_order_number?: string;

  @IsNumber()
  @IsNotEmpty()
  quantity?: number;

  @IsNotEmpty()
  @IsEnum(enumFormOrderStatus)
  status?: enumFormOrderStatus;

  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @IsOptional()
  @IsNumber()
  updatedBy?: number;

  @IsOptional()
  @IsNumber()
  deletedBy?: number;
}
