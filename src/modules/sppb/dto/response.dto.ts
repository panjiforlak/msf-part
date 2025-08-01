import { ApiProperty } from '@nestjs/swagger';

export class SppbListResponseDto {
  @ApiProperty()
  sppb_id: number;

  @ApiProperty()
  sppb_number: string;

  @ApiProperty()
  sppb_date: Date;

  @ApiProperty()
  department_name: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  picker: string;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;
} 