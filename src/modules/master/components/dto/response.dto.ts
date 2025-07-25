import { ApiProperty } from '@nestjs/swagger';
import { inv_type } from '../entities/components.entity';

export class ResponseDto {
  id: number;
  uuid?: string;
  inventory_type: inv_type;
  component_name: string;
  // createdBy: number;
  // createdAt: Date;
  // updatedBy: number;
  // updatedAt: Date | null;
  // deletedBy: number;
  // deletedAt: Date | null;
}
