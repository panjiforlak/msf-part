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
    description: 'Quantity yang akan di-relocate',
    example: 5
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
} 