import { ApiProperty } from '@nestjs/swagger';

export class SppbListResponseDto {
  @ApiProperty({ description: 'SPPB ID', example: 1 })
  sppb_id: number;

  @ApiProperty({ description: 'SPPB Number', example: 'WHO001' })
  sppb_number: string;

  @ApiProperty({ description: 'SPPB Date', example: '2024-01-15T10:00:00Z' })
  sppb_date: Date;

  @ApiProperty({ description: 'Department Name', example: 'Maintenance' })
  department_name: string;

  @ApiProperty({ description: 'Author Name', example: 'John Doe' })
  author: string;

  @ApiProperty({ description: 'Picker Name', example: 'Jane Smith' })
  picker: string;

  @ApiProperty({ description: 'Start Date', example: '2024-01-15T10:00:00Z' })
  start_date: Date;

  @ApiProperty({ description: 'End Date', example: '2024-01-15T10:00:00Z' })
  end_date: Date;

  @ApiProperty({
    description: 'Status',
    example: 'completed',
    enum: ['waiting', 'completed'],
  })
  status: string;
}

export class SparepartListItemDto {
  @ApiProperty({ description: 'Inventory ID', example: 1 })
  inventory_id: number;

  @ApiProperty({ description: 'Tanggal', example: '2024-01-15T10:00:00Z' })
  tanggal: Date;

  @ApiProperty({ description: 'Part Number', example: 'ABC123' })
  part_number: string;

  @ApiProperty({ description: 'Part Name', example: 'Sparepart ABC' })
  part_name: string;

  @ApiProperty({ description: 'Quantity', example: 5 })
  quantity: number;

  @ApiProperty({ description: 'Unit of Measure', example: 'PCS' })
  uom: string;

  @ApiProperty({ description: 'Rack Name', example: 'RACK-A' })
  rack: string;
}

export class SppbDetailResponseDto {
  @ApiProperty({ description: 'SPPB ID', example: 1 })
  sppb_id: number;

  @ApiProperty({ description: 'SPPB Number', example: 'WHO001' })
  sppb_number: string;

  @ApiProperty({
    description: 'Mechanic Photo URL',
    example: 'http://example.com/photo.jpg',
    nullable: true,
  })
  mechanic_photo: string | null;

  @ApiProperty({
    description: 'Status',
    example: 'completed',
    enum: ['waiting', 'completed'],
  })
  status: string;

  @ApiProperty({ description: 'Author Name', example: 'John Doe' })
  author: string;

  @ApiProperty({ description: 'Picker Name', example: 'Jane Smith' })
  picker: string;

  @ApiProperty({ description: 'Department Name', example: 'Maintenance' })
  department: string;

  @ApiProperty({ description: 'Start Date', example: '2024-01-15T10:00:00Z' })
  start_date: Date;

  @ApiProperty({ description: 'End Date', example: '2024-01-15T10:00:00Z' })
  end_date: Date;

  @ApiProperty({
    type: [SparepartListItemDto],
    description: 'List of spareparts',
  })
  sparepart_list: SparepartListItemDto[];
}
