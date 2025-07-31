import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class ScanDestinationDto {
  @ApiProperty({
    description: 'Barcode dari tabel batch_inbound',
    example: 'f58edb181e97'
  })
  @IsString()
  @IsNotEmpty()
  barcode_inbound: string;

  @ApiProperty({
    description: 'Quantity yang akan di-scan',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'ID dari batch outbound',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  batch_outbound_id: number;
} 