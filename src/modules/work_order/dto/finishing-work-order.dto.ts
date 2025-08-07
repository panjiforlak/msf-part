import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class FinishingWorkOrderDto {
  @ApiProperty({
    description:
      'Tanggal selesai work order (format: YYYY-MM-DD atau YYYY-MM-DDTHH:mm:ssZ)',
    example: '2024-08-15',
  })
  @IsNotEmpty({ message: 'End date tidak boleh kosong' })
  @IsString({ message: 'End date harus berupa string' })
  @Matches(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, {
    message:
      'End date harus berupa format tanggal yang valid (YYYY-MM-DD atau YYYY-MM-DDTHH:mm:ssZ)',
  })
  end_date: string;
}
