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

  // @ApiProperty()
  // @IsString()
  // @MaxLength(255)
  // doc_ship_photo?: string;

  @ApiProperty()
  @IsOptional()
  createdBy?: number;

  @ApiProperty()
  @IsOptional()
  updatedBy?: number;
}
