import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  form_order_number: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  approved_spv: string;

  @ApiProperty()
  approved_pjo: string;

  @ApiProperty()
  approved_date_spv: Date;

  @ApiProperty()
  approved_date_pjo: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
