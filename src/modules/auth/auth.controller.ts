/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { successResponse } from '../../common/helpers/response.helper';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );
    const exec = this.authService.login(user);
    return successResponse(exec, 'Login succesfully!');
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    const user = await this.authService.getProfileWithRole(req.user.id);
    return successResponse(user, 'Get profile successfully!');
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const result = await this.authService.sendResetPasswordEmail(body.email);
    return successResponse(result, 'Reset link sent to email');
  }

  // @Post('reset-password')
  // @HttpCode(200)
  // async resetPassword(@Body() dto: ResetPasswordDto) {
  //   const result = await this.authService.resetPassword(dto);
  //   return successResponse(result, 'Password has been reset successfully!');
  // }
}
