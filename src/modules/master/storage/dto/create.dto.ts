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
import { StorageStatus, StorageType } from '../entities/storagearea.entity';

export class CreateStorageAreaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string;

  @IsString()
  @MaxLength(25)
  storage_code?: string;

  @IsEnum(StorageType)
  @IsNotEmpty({ message: 'Storage Type value must be rack or box' })
  storage_type?: StorageType;

  @IsBoolean()
  @IsOptional()
  storage_availability?: boolean;

  @IsEnum(StorageStatus)
  status?: StorageStatus;

  @IsOptional()
  createdBy?: number;

  @IsOptional()
  updatedBy?: number;
}
