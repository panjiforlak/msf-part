import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { wa_status, wa_type } from '../entities/workingarea.entity';

export class CreateDto {
  @ApiProperty({ example: 'WAC|DJUIEW2309E' })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  working_area_code: string;

  @ApiProperty({ example: 'inbound area' })
  @IsEnum(wa_type)
  working_area_type: wa_type;

  @ApiProperty({ example: true })
  working_area_availability: boolean;

  @ApiProperty({ example: 'slow moving' })
  @IsEnum(wa_status)
  working_area_status: wa_status;

  @ApiPropertyOptional({ example: 'test barcode' })
  barcode?: number;

  @ApiPropertyOptional({ example: 'test remark' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;
}
