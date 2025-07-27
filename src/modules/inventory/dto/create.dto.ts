import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiPropertyOptional({
    description: 'Nomor item eksternal',
    example: 'IN-1HGBH41JXMN1918',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  inventory_code?: string;

  @ApiPropertyOptional({
    description: 'Nomor item internal',
    example: 'INI-1HGBH41JXMN1918',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  inventory_internal_code?: string;

  @ApiPropertyOptional({
    description: 'Nama item',
    example: 'Fuel Pump',
    maxLength: 65,
  })
  @IsOptional()
  @IsString()
  @Length(1, 65)
  inventory_name?: string;

  @ApiProperty()
  @IsNumber()
  component_id: number;

  @ApiProperty({
    description: 'Berat dalam satuan tertentu',
    example: 2.2,
  })
  @IsNumber()
  weight: number;

  @ApiPropertyOptional({
    description: 'Unit of Measurement (UOM)',
    example: 'kg',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  uom?: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Keterangan tambahan',
    example: 'mantap',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  remarks: string;

  @ApiProperty()
  @IsNumber()
  racks_id: number;
}
