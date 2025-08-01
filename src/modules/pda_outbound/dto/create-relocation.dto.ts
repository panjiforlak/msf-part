import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateRelocationDto {
  @ApiProperty({
    description: 'Barcode dari tabel batch_inbound',
    example: 'abc123def456'
  })
  @IsString()
  @IsNotEmpty()
  barcode_inbound: string;

  @ApiProperty({
    description: 'ID dari batch_outbound untuk mengambil quantity',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  batch_outbound_id: number;
} 