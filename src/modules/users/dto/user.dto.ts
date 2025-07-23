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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Type(() => Number)
  @IsNumber()
  roleId: number;
}

export class UserResponseDto {
  id: number;
  username: string;
  name: string;
  email: string;
  roleId: number;
  roles?: any;
  meta?: any;
}

export class GetUsersQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  search?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Type(() => Number)
  @IsNumber()
  roleId?: number;

  @IsString()
  reset_password_token?: string | null;

  @Type(() => Date)
  reset_password_expires?: Date | null;
}
export class ForgotPassDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  reset_password_token?: string;

  @Type(() => Date)
  reset_password_expires?: Date;
}

export class DeleteUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Type(() => Boolean)
  @IsNumber()
  isActive: boolean;
}
