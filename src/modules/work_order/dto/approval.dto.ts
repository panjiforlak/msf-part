import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ApprovalStatus {
  APPROVAL = 'approval',
  REJECTED = 'rejected',
}

export class ApprovalDto {
  @ApiProperty({
    description: 'Status approval untuk work order',
    enum: ApprovalStatus,
    example: 'approval',
  })
  @IsNotEmpty({ message: 'Status tidak boleh kosong' })
  @IsEnum(ApprovalStatus, {
    message: 'Status harus berupa approval atau reject',
  })
  status: ApprovalStatus;

  @ApiProperty({
    description: 'Catatan/remark untuk approval',
    example: 'Sparepart sudah tersedia dan siap diproses',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Remark harus berupa string' })
  remark?: string;
}
