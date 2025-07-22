import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { FindOneOptions, ILike, Repository } from 'typeorm';
import { RabbitmqService } from '../../integrations/rabbitmq/rabbitmq.service';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import * as bcrypt from 'bcrypt';
import {
  CreateUserDto,
  UserResponseDto,
  GetUsersQueryDto,
  UpdateUserDto,
  ForgotPassDto,
} from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { randomBytes } from 'crypto';
import { MailService } from '../../integrations/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly mailService: MailService,
  ) {}

  async findByUsername(username: string): Promise<Users | null> {
    return this.userRepository.findOne({
      where: {
        username,
        isActive: true,
      },
      withDeleted: false,
      relations: ['roles'],
    });
  }

  async findByPassword(token: string): Promise<Users | null> {
    return this.userRepository.findOne({
      where: {
        reset_password_token: token,
        isActive: true,
      },
      withDeleted: false,
      relations: ['roles'],
    });
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findOne({
      where: {
        email,
        isActive: true,
      },
      withDeleted: false,
      relations: ['roles'],
    });
  }

  async findByIdWithRole(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async findById(id: number): Promise<ApiResponse<any>> {
    const result: any = await this.userRepository.findOne({ where: { id } });
    if (!result) {
      throwError('User not found', 404);
    }
    const response: any = {
      id: result.id,
      username: result.username,
      name: result.name,
      roleId: result.roleId,
    };
    return successResponse(response);
  }

  async findAll(
    query: GetUsersQueryDto,
  ): Promise<ApiResponse<UserResponseDto[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.userRepository.findAndCount({
        where: query.search
          ? [
              { username: ILike(`%${query.search}%`) },
              { name: ILike(`%${query.search}%`) },
            ]
          : {},
        skip,
        take: limit,
        relations: ['roles'],
      });
      const transformedResult = plainToInstance(Users, result, {
        excludeExtraneousValues: true,
      });
      return paginateResponse(
        transformedResult,
        total,
        page,
        limit,
        'Get users susccessfuly',
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async create(data: CreateUserDto): Promise<ApiResponse<UserResponseDto>> {
    try {
      const existing = await this.findByUsername(data.username);
      if (existing) {
        throwError('Username already registered', 409);
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = this.userRepository.create({
        ...data,
        password: hashedPassword,
      });
      const result = await this.userRepository.save(newUser);
      const response: UserResponseDto = {
        id: result.id,
        username: result.username,
        name: result.name,
        email: result.email,
        roleId: result.roleId,
      };

      return successResponse(response);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(
    id: number,
    updateDto: UpdateUserDto,
  ): Promise<ApiResponse<Users>> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throwError('User not found', 404);
      }

      const updatedUser = this.userRepository.merge(user!, updateDto);
      const result = await this.userRepository.save(updatedUser);
      const response: any = {
        id: result.id,
        username: result.username,
        name: result.name,
        email: result.email,
        roleId: result.roleId,
      };
      return successResponse(response, 'User updated successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throwError('User not found', 404);
      }
      await this.userRepository.softRemove(user!);

      return successResponse(null, 'User deleted successfully');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async sendResetPasswordEmail(email: string) {
    try {
      const user = await this.findByEmail(email);

      if (user) {
        const token = randomBytes(32).toString('hex');
        console.log('Reset token:', token); // For debugging purposes
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        console.log('Reset expires:', expires); // For debugging purposes

        user.reset_password_token = token;
        user.reset_password_expires = expires;
        await this.userRepository.save(user);
        console.log('Reset expires:', user); // For debugging purposes
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await this.mailService.sendEmail(
          email,
          'Reset Password',
          `Click here to reset your password: ${resetLink}`,
        );
      }

      return {
        message:
          'If your email is registered, we have sent you a password reset link.',
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throwError('Something went wrong. Please try again later.', 500);
    }
  }
}
