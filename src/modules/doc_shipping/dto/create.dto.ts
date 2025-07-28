import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateDocShipDto {
  @ApiProperty()
  @IsString()
  @MaxLength(35)
  doc_ship_no?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary', // <-- ini WAJIB untuk file di Swagger UI
  })
  file: any;

  @ApiProperty({
    description: 'Array of batch inbound items as JSON string',
    type: String,
    example: `[{
      "inventory_id": 1,
      "quantity": 100,
      "supplier_id": 1,
      "picker_id": 1,
      "lifetime": 2,
      "price": 15000,
      "arrival_date": "2025-07-28",
      "status_reloc": "inbound"
    }]`,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchInboundItemDto)
  items: BatchInboundItemDto[];
  // @ApiProperty()
  // @IsString()
  // @MaxLength(255)
  // doc_ship_photo?: string;

  @IsOptional()
  createdBy?: number;

  @IsOptional()
  updatedBy?: number;
}

export class BatchInboundItemDto {
  @ApiProperty()
  inventory_id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  supplier_id: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  picker_id: number;

  @ApiProperty()
  life_time: number;

  @ApiProperty()
  arrival_date: string; // format YYYY-MM-DD

  @ApiProperty()
  status_reloc: 'inbound' | 'storage';
}
