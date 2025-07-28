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

  // @ApiProperty()
  // @IsString()
  // @MaxLength(255)
  // doc_ship_photo?: string;

  @IsOptional()
  createdBy?: number;

  @IsOptional()
  updatedBy?: number;
}
