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
import { StorageStatus, StorageType } from '../entities/storagearea.entity';

export class CreateStorageAreaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;

  @IsOptional()
  @IsEnum(StorageType)
  storage_type?: StorageType;

  @IsOptional()
  @IsBoolean()
  storage_availability?: boolean;

  @IsOptional()
  @IsEnum(StorageStatus)
  status?: StorageStatus;

  @IsOptional()
  createdBy?: number;

  @IsOptional()
  updatedBy?: number;
}
