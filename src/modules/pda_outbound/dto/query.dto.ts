import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';

export class PdaOutboundQueryDto {
  @ApiPropertyOptional({
    description:
      'Parameter untuk superadmin, jika "yes" maka menampilkan semua data',
    enum: ['yes', 'no'],
    example: 'no',
  })
  @IsOptional()
  @IsIn(['yes', 'no'])
  superadmin?: string;
}
