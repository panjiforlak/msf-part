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
  @ApiProperty({ example: 'Repair DT', description: 'Nama aktivitas' })
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(EnumCategory)
  @ApiProperty({
    enum: EnumCategory,
    default: `${EnumCategory.BREAKDOWN} enum => ('breakdown','working','delay','idle')`,
  })
  status?: EnumCategory;

  @IsOptional()
  createdBy?: number;

  @IsOptional()
  updatedBy?: number;
}
