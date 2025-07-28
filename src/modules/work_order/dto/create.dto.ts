import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WorkOrderStatus } from '../entities/order_form.entity';

export class SparepartDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  part_name: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  destination: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateWorkOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  vin_number: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  driver: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  mechanic: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  request: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  departement: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  remark: string;

  @ApiProperty({ type: String, format: 'date' })
  @IsString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({ type: String, format: 'date' })
  @IsString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({ enum: WorkOrderStatus })
  @IsEnum(WorkOrderStatus)
  status: WorkOrderStatus;

  @ApiProperty({ type: [SparepartDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SparepartDto)
  sparepart_list: SparepartDto[];
}
