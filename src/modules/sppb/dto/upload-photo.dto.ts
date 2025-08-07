import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UploadPhotoDto {
  @ApiProperty({
    description: 'SPPB ID',
    example: 1,
  })
  @IsNumber()
  sppb_id: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Mechanic photo file (image)',
  })
  mechanic_photo: any;
}
