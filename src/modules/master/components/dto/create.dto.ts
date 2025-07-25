import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { inv_type } from '../entities/components.entity';

export class CreateDto {
  @ApiProperty()
  @IsOptional()
  @IsEnum(inv_type)
  inventory_type?: inv_type;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(15)
  component_name?: string;

  @ApiProperty()
  @IsOptional()
  createdBy?: number;

  @ApiProperty()
  @IsOptional()
  updatedBy?: number;
}
