import { PartialType } from '@nestjs/mapped-types';
import { CreateFormOrderDto } from './create.dto';
import { ApiProperty } from '@nestjs/swagger';
import { enumFormOrderStatus } from '../entities/formOrder.entity';

export class UpdateDto extends PartialType(CreateFormOrderDto) {
  @ApiProperty({
    example: 1,
  })
  inventory_id?: number;

  @ApiProperty({
    example: 'IN-1HGBH41JXMN1918',
  })
  form_order_number?: string;

  @ApiProperty({
    example: 10,
  })
  quantity?: number;

  @ApiProperty({
    example: `ENUM => ('breakdown','working','delay','idle')`,
  })
  status?: enumFormOrderStatus;
}
