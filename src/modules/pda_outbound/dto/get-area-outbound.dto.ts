import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetAreaOutboundDto {
  @ApiProperty({
    description: 'Barcode area dari tabel inbound_outbound_area',
    example: 'abc123def456',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  barcode_area: string;
}

export class GetAreaOutboundResponseDto {
  @ApiProperty({
    description: 'ID area',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Barcode area',
    example: 'abc123def456'
  })
  barcode: string;

  @ApiProperty({
    description: 'Kode area inout',
    example: 'AREA001'
  })
  inout_area_code: string;

  @ApiProperty({
    description: 'Keterangan area',
    example: 'Area untuk outbound'
  })
  remarks: string;

  @ApiProperty({
    description: 'Tipe area',
    example: 'outbound',
    enum: ['others', 'inbound', 'outbound']
  })
  type: string;

  @ApiProperty({
    description: 'Tanggal dibuat',
    example: '2024-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Tanggal diupdate',
    example: '2024-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
} 