import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EnumCategory } from '../entities/activity.entity';

export class UpdateDto extends PartialType(CreateActivityDto) {
  @ApiPropertyOptional({
    example: 'Repair DT Updated',
    description: 'Nama aktivitas (opsional, hanya kalau ingin diubah)',
  })
  name?: string;

  @ApiPropertyOptional({
    example: `breakdown ENUM => ('breakdown','working','delay','idle')`,
    default: `${EnumCategory.BREAKDOWN} ENUM => ('breakdown','working','delay','idle')`,
    type: String,
    description: 'Tanggal aktivitas (opsional, hanya kalau ingin diubah)',
  })
  status?: EnumCategory;
}
