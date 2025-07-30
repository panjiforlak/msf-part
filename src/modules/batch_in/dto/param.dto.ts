import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ParamsDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Search barcodenya',
  })
  @ApiProperty({ example: 'example : IUuihSZuih' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Storage = b2r',
  })
  @ApiProperty({ example: 'example : IUuihSZuih' })
  @IsOptional()
  @IsString()
  storage?: string;

  @ApiPropertyOptional({
    description: 'Super admin : yes',
  })
  @ApiProperty({ example: 'example : IUuihSZuih' })
  @IsOptional()
  @IsString()
  superadmin?: string;
}
