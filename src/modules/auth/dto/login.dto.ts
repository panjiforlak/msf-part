import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty({ example: 'usertest' })
  username: string;

  @ApiProperty({ example: 'admin123' })
  password: string;
}
