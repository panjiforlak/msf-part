import { ApiProperty } from '@nestjs/swagger';
import { StorageStatus, StorageType } from '../entities/storagearea.entity';

export class ResponseDto {
  id: number;
  barcode?: string;
  storage_code: string;
  remarks?: string;
  storage_type: StorageType;
  storage_availability: boolean;
  status: StorageStatus;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date | null;
  deletedBy: number;
  deletedAt: Date | null;
}
