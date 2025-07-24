import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  working_area_code?: string;

  @ApiProperty()
  working_area_type?: string;

  @ApiProperty()
  working_area_availability?: boolean;

  @ApiProperty()
  working_area_status?: string;

  @ApiProperty()
  barcode?: number;

  @ApiProperty()
  remarks?: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
