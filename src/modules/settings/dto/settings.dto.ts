import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  IsOptional,
  IsNumberString,
} from 'class-validator';
import { JoinColumn, ManyToOne } from 'typeorm';

export class CreateSettingsDto {
  @IsString()
  @IsNotEmpty()
  roleCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  role_parent: number;
}

export class RolesResponseDto {
  id: number;
  roleCode: string;
  name: string;
  role_parent: number;
  meta?: any;
}

export class GetSettingsDetailDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  search?: string;
}

export class GetSettingsQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  search?: string;
}

export class UpdateSettingsDto {
  @IsString()
  value?: string;
}
export class CreatedSettingsDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  value?: string;

  @IsString()
  form_type?: string;
}
export class SettingsResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  value?: string;

  @IsString()
  form_type?: string;
}
