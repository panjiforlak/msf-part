import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum ApprovalStatus {
  APPROVAL = 'approval',
  REJECT = 'reject',
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
}
