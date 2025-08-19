import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInventoryDto {
  @ApiProperty({
    description: 'Nomor item eksternal',
    example: 'IN-1HGBH41JXMN1918',
    maxLength: 30,
  })
  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  inventory_code?: string;

  @ApiProperty({
    description: 'Nomor item internal',
    example: 'INI-1HGBH41JXMN1918',
    maxLength: 30,
  })
  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  inventory_internal_code?: string;

  @ApiProperty({
    description: 'Nama item',
    example: 'Fuel Pump',
    maxLength: 65,
  })
  @IsString()
  @Length(1, 65)
  @IsNotEmpty()
  inventory_name?: string;

  @ApiPropertyOptional({
    description: 'Spesification item',
    example: '',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 65)
  @IsOptional()
  spesification?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  component_id: number;

  @ApiProperty({
    description: 'Berat dalam satuan tertentu',
    example: 2.2,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  weight: number;

  @ApiProperty({
    description: 'Unit of Measurement (UOM)',
    example: 'kg',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  uom: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Keterangan tambahan',
    example: 'mantap',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  remarks: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  racks_id: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  safety_stock: number;

  @ApiPropertyOptional({
    description: 'Photo inventory',
    example: '',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  inventory_photo?: any;
}
