import { PartialType } from '@nestjs/mapped-types';
import { CreateFormOrderDto } from './create.dto';
import { ApiProperty } from '@nestjs/swagger';
import { enumFormOrderStatus } from '../entities/formOrder.entity';

export class UpdateDto extends PartialType(CreateFormOrderDto) {
  inventory_id?: number;

  form_order_number?: string;
  @ApiProperty()
  remarks?: string;

  quantity?: number;

  status?: enumFormOrderStatus;

  approved_spv: number;

  approved_pjo: number;

  approved_date_spv: Date;

  approved_date_pjo: Date;
}
