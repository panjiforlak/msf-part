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
import { inout_type } from '../entities/inout.entity';

export class CreateInOutAreaDto {
  @ApiProperty()
  @IsString()
  @MaxLength(15)
  inout_area_code?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;

  @ApiProperty()
  @IsEnum(inout_type)
  type?: inout_type;

  @ApiProperty()
  @IsOptional()
  createdBy?: number;

  @ApiProperty()
  @IsOptional()
  updatedBy?: number;
}
