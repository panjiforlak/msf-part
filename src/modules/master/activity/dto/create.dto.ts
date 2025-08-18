import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnumCategory } from '../entities/activity.entity';

export class CreateActivityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(EnumCategory)
  status?: EnumCategory;

  @IsOptional()
  createdBy?: number;

  @IsOptional()
  updatedBy?: number;
}
