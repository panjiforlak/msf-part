import { Expose, Exclude, Type } from 'class-transformer';
import { IsOptional, IsNumberString, IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoinColumn, ManyToOne } from 'typeorm';
import { EmploymentStatus } from '../entities/employee.entity';

export class GetEmployeeQueryDto {
  @ApiProperty({ description: 'Employee ID', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Employee NIP', example: '123456789' })
  @Expose()
  nip: string;

  @ApiProperty({ description: 'Employee first name', example: 'John' })
  @Expose()
  first_name: string;

  @ApiProperty({ description: 'Employee last name', example: 'Doe' })
  @Expose()
  last_name: string;

  @ApiProperty({ description: 'Employee division', example: 'IT' })
  @Expose()
  division: string;

  @ApiProperty({ description: 'Employee position', example: 'Developer' })
  @Expose()
  position: string;

  @ApiProperty({ description: 'Employee salary', example: '5000000' })
  @Expose()
  sallary: string;

  @ApiProperty({ description: 'Employee status', example: 'active', enum: ['active', 'inactive'] })
  @Expose()
  status: string;
}

export class QueryParamDto {
  @ApiPropertyOptional({ 
    description: 'Page number for pagination', 
    example: '1',
    type: String 
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ 
    description: 'Number of items per page', 
    example: '10',
    type: String 
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ 
    description: 'Search term for employee name or NIP', 
    example: 'John',
    type: String 
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateEmployeeDto {
  @ApiProperty({ 
    description: 'Employee NIP (Nomor Induk Pegawai)', 
    example: '123456789',
    type: String 
  })
  @IsNotEmpty()
  @IsString()
  nip: string;

  @ApiProperty({ 
    description: 'Employee first name', 
    example: 'John',
    type: String 
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ 
    description: 'Employee last name', 
    example: 'Doe',
    type: String 
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ 
    description: 'Employee division', 
    example: 'IT',
    type: String 
  })
  @IsNotEmpty()
  @IsString()
  division: string;

  @ApiProperty({ 
    description: 'Employee position', 
    example: 'Developer',
    type: String 
  })
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty({ 
    description: 'Employee salary', 
    example: '5000000',
    type: String 
  })
  @IsNotEmpty()
  @IsString()
  sallary: string;

  @ApiPropertyOptional({ 
    description: 'Employee status', 
    example: 'active',
    enum: ['active', 'inactive'],
    type: String 
  })
  @IsEnum(EmploymentStatus)
  status?: EmploymentStatus;
}

export class ReturnResponseDto {
  @ApiProperty({ description: 'Employee ID', example: 1 })
  id: number;

  @ApiPropertyOptional({ description: 'Employee NIP', example: '123456789' })
  nip?: string;

  @ApiPropertyOptional({ description: 'Employee first name', example: 'John' })
  first_name?: string;

  @ApiPropertyOptional({ description: 'Employee last name', example: 'Doe' })
  last_name?: string;

  @ApiPropertyOptional({ description: 'Employee division', example: 'IT' })
  division?: string;

  @ApiPropertyOptional({ description: 'Employee position', example: 'Developer' })
  position?: string;

  @ApiPropertyOptional({ description: 'Employee salary', example: '5000000' })
  sallary?: string;

  @ApiPropertyOptional({ description: 'Employee status', example: 'active' })
  @IsEnum(EmploymentStatus)
  status?: EmploymentStatus;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date | null;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  meta?: any;
}
