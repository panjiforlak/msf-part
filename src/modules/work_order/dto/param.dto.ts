import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ParamsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by order type',
    enum: ['sparepart', 'non sparepart'],
    example: 'sparepart'
  })
  @IsOptional()
  @IsString()
  @IsIn(['sparepart', 'non sparepart'])
  order_type?: string;
}
