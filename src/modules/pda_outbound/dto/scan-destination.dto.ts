import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class ScanDestinationDto {
  @ApiProperty({
    description: 'ID dari batch inbound',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  batch_in_id: number;

  @ApiProperty({
    description: 'ID dari inbound outbound area',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  inbound_outbound_area_id: number;

  @ApiProperty({
    description: 'Quantity yang akan di-scan',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'ID dari batch outbound',
    example: 18
  })
  @IsNumber()
  @IsNotEmpty()
  batch_outbound_id: number;
} 