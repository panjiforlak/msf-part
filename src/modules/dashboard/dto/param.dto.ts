import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ParamsDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiProperty({ example: 'daily | mothly | annualy' })
  @IsOptional()
  @IsString()
  periode_type?: string;
}
