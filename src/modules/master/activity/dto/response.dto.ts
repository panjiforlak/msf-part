import { ApiProperty } from '@nestjs/swagger';
import { EnumCategory } from '../entities/activity.entity';

export class ResponseDto {
  id: number;
  name: string;
  category: EnumCategory;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date | null;
  deletedBy: number;
  deletedAt: Date | null;
}
