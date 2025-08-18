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
  @ApiProperty({
    description: 'ID inventory yang terkait dengan form order',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  inventory_id?: number;

  @ApiProperty({
    description: 'Nomor form order',
    example: 'IN-1HGBH41JXMN1918',
  })
  @IsString()
  @IsNotEmpty()
  form_order_number?: string;

  @ApiProperty({
    description: 'Jumlah item yang dipesan',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity?: number;

  @ApiProperty({
    description: 'Status dari form order',
    example: 'ENUM => ordered | pending | packing | in-order | finished',
  })
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
