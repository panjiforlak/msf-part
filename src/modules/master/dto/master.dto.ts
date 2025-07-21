import { Expose, Type } from 'class-transformer';
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
import { Items } from '../entities/master.entity';

export class CreateMasterDto {
  @Type(() => Number)
  @IsNumber()
  category_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  icon: string;

  @IsString()
  link: string;
}

export class MasterResponseDto {
  category_id: number;
  title: string;
  description: string;
  icon: string;
  link: string;
  meta?: any;
}

export class GetMasterQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  search?: string;
}

export class GetMasterDataDto {
  category: string;

  @Type(() => Items)
  items: ItemDto[];
}

export class ItemDto {
  title: string;
  desc: string;
  icon: string;
  link: string;
}

export class GetMasterDataQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  search?: string;
}

export class UpdateMasterDto {
  @IsString()
  @IsNotEmpty()
  roleCode: string;

  @Type(() => Number)
  @IsNumber()
  category_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;
}

// export class DeleteUserDto {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @Type(() => Boolean)
//   @IsNumber()
//   isActive: boolean;
// }
