import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignPickerDto {
  @ApiProperty({
    description: 'ID picker dari tabel employee',
    example: 1,
  })
  @IsNotEmpty({ message: 'Picker ID tidak boleh kosong' })
  @IsNumber({}, { message: 'Picker ID harus berupa angka' })
  picker_id: number;
}
