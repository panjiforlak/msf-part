import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  inventory_id: number;

  @ApiProperty()
  form_order_number: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
