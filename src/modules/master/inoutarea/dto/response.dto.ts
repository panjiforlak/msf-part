import { ApiProperty } from '@nestjs/swagger';
import { inout_type } from '../entities/inout.entity';

export class ResponseDto {
  id: number;
  barcode?: string;
  inout_area_code: string;
  remarks?: string;
  type: inout_type;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date | null;
  deletedBy: number;
  deletedAt: Date | null;
}
