import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString } from 'class-validator';

export class FinishingWorkOrderDto {
  @ApiProperty({
    description: 'Tanggal selesai work order',
    example: '2024-01-15T10:30:00Z',
  })
  @IsNotEmpty({ message: 'End date tidak boleh kosong' })
  @IsDateString(
    {},
    { message: 'End date harus berupa format tanggal yang valid' },
  )
  end_date: string;
}
