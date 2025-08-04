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
import { WorkOrderStatus, OrderType } from '../entities/order_form.entity';

export class SparepartDto {
  @ApiProperty({ description: 'Inventory ID from inventory table' })
  @IsNumber()
  @IsNotEmpty()
  inventory_id: number;

  @ApiProperty({ description: 'Quantity to be processed' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateWorkOrderDto {
  @ApiProperty({ 
    description: 'Vehicle ID from vehicles table (can be 0 or null for non-vehicle orders)',
    required: false,
    example: 0
  })
  @IsOptional()
  @IsNumber()
  vehicle_id: number;

  @ApiProperty({ description: 'Driver ID from users table' })
  @IsNumber()
  @IsNotEmpty()
  driver: number;

  @ApiProperty({ description: 'Mechanic ID from users table' })
  @IsNumber()
  @IsNotEmpty()
  mechanic: number;

  @ApiProperty({ description: 'Request user ID from users table' })
  @IsNumber()
  @IsNotEmpty()
  request: number;

  @ApiProperty({ description: 'Department name (free text)' })
  @IsString()
  @IsNotEmpty()
  departement: string;

  @ApiProperty({ description: 'Remark (free text)' })
  @IsString()
  @IsNotEmpty()
  remark: string;

  @ApiProperty({ enum: OrderType, description: 'Order type: sparepart or non sparepart' })
  @IsEnum(OrderType)
  @IsNotEmpty()
  order_type: OrderType;

  @ApiProperty({
    type: String,
    format: 'date',
    description: 'Start date in YYYY-MM-DD format',
  })
  @IsString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({
    type: String,
    format: 'date',
    description: 'End date in YYYY-MM-DD format',
  })
  @IsString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({ enum: WorkOrderStatus, description: 'Work order status' })
  @IsEnum(WorkOrderStatus)
  status: WorkOrderStatus;

  @ApiProperty({
    type: [SparepartDto],
    description: 'List of spareparts to be processed',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SparepartDto)
  sparepart_list: SparepartDto[];
}
