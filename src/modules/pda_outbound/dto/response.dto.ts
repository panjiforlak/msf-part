import { ApiProperty } from '@nestjs/swagger';
import { WorkOrderStatus, OrderType } from '../../work_order/entities/order_form.entity';

export class PdaOutboundResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  vehicle_id: number;

  @ApiProperty()
  admin_id: number;

  @ApiProperty()
  driver_id: number;

  @ApiProperty()
  mechanic_id: number;

  @ApiProperty()
  picker_id: number;

  @ApiProperty()
  request_id: number;

  @ApiProperty()
  departement: string;

  @ApiProperty()
  remark: string;

  @ApiProperty({ enum: OrderType })
  order_type: OrderType;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty({ enum: WorkOrderStatus })
  status: WorkOrderStatus;

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

  @ApiProperty()
  approvalBy: number;

  @ApiProperty()
  approvalAt: Date;

  @ApiProperty()
  label_wo: string;
} 