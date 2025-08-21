import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { enumFormOrderStatus } from '../entities/formOrder.entity';
import { Type } from 'class-transformer';

export class CreateFormOrderDetailDto {
  @ApiProperty({
    example: 1,
    description: 'ID inventory',
  })
  @IsNumber()
  @IsNotEmpty()
  inventory_id: number;

  @ApiProperty({
    example: 5,
    description: 'Jumlah barang yang dipesan',
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Quantity minimal 1' })
  quantity: number;
}
export class CreateFormOrderDto {
  @ApiProperty({
    example: 'Masukan Remarks',
  })
  @IsString()
  @IsOptional()
  remarks?: string;

  @IsOptional()
  @IsEnum(enumFormOrderStatus)
  status?: enumFormOrderStatus;

  @ApiProperty({
    description: 'List of form order details',
    type: [CreateFormOrderDetailDto], // <- array of object DTO
  })
  @ValidateNested({ each: true })
  @Type(() => CreateFormOrderDetailDto)
  @IsArray()
  @IsNotEmpty()
  fo_details: CreateFormOrderDetailDto[];

  @IsOptional()
  @IsNumber()
  createdBy?: number;

  @IsOptional()
  @IsNumber()
  approved_spv?: number;

  @IsOptional()
  @IsNumber()
  approved_pjo?: number;

  @IsOptional()
  @IsDate()
  approved_date_spv?: Date;

  @IsOptional()
  @IsDate()
  approved_date_pjo?: Date;

  @IsOptional()
  @IsNumber()
  updatedBy?: number;

  @IsOptional()
  @IsNumber()
  deletedBy?: number;
}
