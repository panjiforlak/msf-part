import { Expose, Exclude, Type } from 'class-transformer';
import { IsOptional, IsNumberString, IsEnum } from 'class-validator';
import { JoinColumn, ManyToOne } from 'typeorm';
import { EmploymentStatus } from '../entities/employee.entity';

export class GetEmployeeQueryDto {
  @Expose()
  id: number;

  @Expose()
  nip: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  division: string;

  @Expose()
  position: string;

  @Expose()
  sallary: string;
}

export class QueryParamDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  search?: string;
}

export class CreateEmployeeDto {
  nip: string;
  first_name: string;
  last_name: string;
  division: string;
  position: string;
  sallary: string;
  status?: string;
}

export class ReturnResponseDto {
  id: number;
  nip?: string;
  first_name?: string;
  last_name?: string;
  division?: string;
  position?: string;
  sallary?: string;
  @IsEnum(EmploymentStatus)
  status?: EmploymentStatus;
  createdAt?: Date;
  updatedAt?: Date | null;
  meta?: any;
}
