import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
      "price": 15000,
      "arrival_date": "2025-07-28",
      "status_reloc": "inbound"
    }]`,
  })
  @IsString()
  @Transform(({ value }) => {
    try {
      return JSON.parse(value); // ubah string menjadi array of object
    } catch {
      return [];
    }
  })
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
  arrival_date: string; // format YYYY-MM-DD

  @ApiProperty()
  status_reloc: 'inbound' | 'storage';
}
