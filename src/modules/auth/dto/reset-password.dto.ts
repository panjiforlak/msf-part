import { IsString, MinLength } from 'class-validator';
import { Match } from '../match.decorator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @Match('password', { message: 'Confirm password does not match' })
  confirmPassword: string;
}
