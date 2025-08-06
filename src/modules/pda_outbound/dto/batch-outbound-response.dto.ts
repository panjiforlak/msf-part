import { ApiProperty } from '@nestjs/swagger';
import { batchout_type } from '../../work_order/entities/batch_outbound.entity';

export class BatchOutboundResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  batch_outbound_id: number;

  @ApiProperty()
  inventory_id: number;

  @ApiProperty()
  destination_id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  part_number: string;

  @ApiProperty()
  part_name_label: string;

  @ApiProperty()
  remark: string;

  @ApiProperty({ enum: batchout_type })
  status: batchout_type;

  @ApiProperty()
  racks_name: string;

  @ApiProperty()
  label_wo: string;

  @ApiProperty()
  quantity_queue: number;
} 