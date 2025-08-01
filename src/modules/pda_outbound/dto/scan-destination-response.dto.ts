import { ApiProperty } from '@nestjs/swagger';

export class ScanDestinationResponseDto {
  @ApiProperty({
    description: 'ID dari relocation yang dibuat',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Barcode inbound yang di-scan',
    example: 'f58edb181e97'
  })
  barcode_inbound: string;

  @ApiProperty({
    description: 'Quantity yang di-scan',
    example: 1
  })
  quantity: number;

  @ApiProperty({
    description: 'Total quantity yang sudah di-scan',
    example: 3
  })
  total_scanned_quantity: number;

  @ApiProperty({
    description: 'Target quantity yang harus dicapai',
    example: 3
  })
  target_quantity: number;

  @ApiProperty({
    description: 'Status apakah sudah mencapai target quantity',
    example: false
  })
  is_completed: boolean;

  @ApiProperty({
    description: 'ID dari SPPB yang dibuat (jika sudah completed)',
    example: null
  })
  sppb_id?: number;

  @ApiProperty({
    description: 'Nomor SPPB yang dibuat (jika sudah completed)',
    example: null
  })
  sppb_number?: string;
} 