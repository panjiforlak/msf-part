import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RelocationHistoryResponseDto {
  @ApiProperty({
    description: 'ID dari relocation',
    example: 1,
  })
  relocation_id: number;

  @ApiProperty({
    description: 'Tanggal relocation',
    example: '2024-01-15T10:30:00Z',
  })
  tanggal: Date;

  @ApiProperty({
    description: 'Nama part dari inventory',
    example: 'Engine Oil Filter',
  })
  part_name: string;

  @ApiProperty({
    description: 'Internal code item dari inventory',
    example: 'INT-001',
  })
  part_internal_code_item: string;

  @ApiProperty({
    description: 'Quantity yang direlokasi',
    example: 10,
  })
  quantity: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'PCS',
  })
  uom: string;

  @ApiProperty({
    description: 'Nama picker',
    example: 'John Doe',
  })
  picker_name: string;

  @ApiProperty({
    description: 'Nama rack storage',
    example: 'RACK-A1',
  })
  rack_name: string;

  @ApiProperty({
    description: 'Nama area outbound',
    example: 'OUTBOUND-01',
  })
  outbound_area_name: string;
}

export class RelocationHistoryQueryDto {
  @ApiPropertyOptional({
    description: 'Keyword untuk filter semua field',
    example: 'engine',
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
