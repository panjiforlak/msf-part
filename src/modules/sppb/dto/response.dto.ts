import { ApiProperty } from '@nestjs/swagger';

export class SppbListResponseDto {
  @ApiProperty()
  sppb_id: number;

  @ApiProperty()
  sppb_number: string;

  @ApiProperty()
  sppb_date: Date;

  @ApiProperty()
  department_name: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  picker: string;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;
}

export class SparepartListItemDto {
  @ApiProperty()
  inventory_id: number;

  @ApiProperty()
  tanggal: Date;

  @ApiProperty()
  part_number: string;

  @ApiProperty()
  part_name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  uom: string;

  @ApiProperty()
  rack: string;
}

export class SppbDetailResponseDto {
  @ApiProperty()
  sppb_id: number;

  @ApiProperty()
  sppb_number: string;

  @ApiProperty()
  mechanic_photo: string | null;

  @ApiProperty()
  status: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  picker: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty({ type: [SparepartListItemDto] })
  sparepart_list: SparepartListItemDto[];
} 