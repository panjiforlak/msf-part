import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  item_id: number;

  @ApiProperty({ required: false })
  inventory_code?: string;

  @ApiProperty({ required: false })
  inventory_internal_code?: string;

  @ApiProperty()
  inventory_name: string;

  @ApiProperty()
  component_id: number;

  @ApiProperty()
  weight: number;

  @ApiProperty({ required: false })
  uom?: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  remarks: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
