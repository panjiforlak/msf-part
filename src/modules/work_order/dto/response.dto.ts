import { ApiProperty } from '@nestjs/swagger';
import { WorkOrderStatus } from '../entities/order_form.entity';

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
  request: string;

  @ApiProperty()
  departement: string;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty({ enum: WorkOrderStatus })
  status: WorkOrderStatus;

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
