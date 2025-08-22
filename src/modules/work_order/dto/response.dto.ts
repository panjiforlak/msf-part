import { ApiProperty } from '@nestjs/swagger';
import { WorkOrderStatus, OrderType } from '../entities/order_form.entity';

export class SparepartResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  part_name: number;

  @ApiProperty()
  destination: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  breakdown_time: Date;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  part_number: string;

  @ApiProperty()
  part_name_label: string;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  racks_name: string;
}

export class WorkOrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  vin_number: string;

  @ApiProperty()
  driver: string;

  @ApiProperty()
  mechanic: string;

  @ApiProperty()
  picker: string;

  @ApiProperty()
  request: string;

  @ApiProperty()
  departement: string;

  @ApiProperty()
  remark: string;

  @ApiProperty({ enum: OrderType })
  order_type: OrderType;

  @ApiProperty()
  start_date: Date;

  @ApiProperty({ required: false })
  end_date: Date | null;

  @ApiProperty()
  breakdown_time: Date;

  @ApiProperty({ enum: WorkOrderStatus })
  status: WorkOrderStatus;

  @ApiProperty()
  approval_by: string;

  @ApiProperty()
  approval_remark: string;

  @ApiProperty({ type: [SparepartResponseDto] })
  sparepart_list: SparepartResponseDto[];

  @ApiProperty()
  createdBy: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedBy: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedBy: number;

  @ApiProperty()
  deletedAt: Date;
}
