import {
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { ILike, Repository } from 'typeorm';
import {
  ApiResponse,
  successResponse,
  throwError,
} from '../../common/helpers/response.helper';
import { paginateResponse } from '../../common/helpers/public.helper';
import * as bcrypt from 'bcrypt';
import {
  CreateRolesDto,
  RolesResponseDto,
  GetRolesQueryDto,
  UpdateRolesDto,
} from './dto/roles.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  async findByName(name: string): Promise<Roles | null> {
    return this.rolesRepository.findOne({
      where: {
        name,
      },
      withDeleted: false,
    });
  }

  async findById(id: number): Promise<ApiResponse<any>> {
    const result: any = await this.rolesRepository.findOne({ where: { id } });
    if (!result) {
      throwError('Roles not found', 404);
    }
    const response: any = {
      id: result.id,
      name: result.name,
    };
    return successResponse(response);
  }

  async findAll(query: GetRolesQueryDto): Promise<ApiResponse<Roles[]>> {
    try {
      const page = parseInt(query.page ?? '1', 10);
      const limit = parseInt(query.limit ?? '10', 10);
      const skip = (page - 1) * limit;

      const [result, total] = await this.rolesRepository.findAndCount({
        where: query.search ? [{ name: ILike(`%${query.search}%`) }] : {},
        skip,
        take: limit,
        relations: ['parent'],
      });
      const transformedResult = plainToInstance(Roles, result, {
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

  async create(data: CreateRolesDto): Promise<ApiResponse<RolesResponseDto>> {
    try {
      const existing = await this.findByName(data.name);
      if (existing) {
        throwError('Role name already exists', 409);
      }

      const newUser = this.rolesRepository.create(data);
      const result = await this.rolesRepository.save(newUser);
      const response: RolesResponseDto = {
        id: result.id,
        roleCode: result.roleCode,
        name: result.name,
        role_parent: result.role_parent,
      };

      return successResponse(response, 'Create new role successfully', 201);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  //   async update(
  //     id: number,
  //     updateDto: UpdateUserDto,
  //   ): Promise<ApiResponse<Users>> {
  //     try {
  //       const user = await this.rolesRepository.findOne({ where: { id } });

  //       if (!user) {
  //         throwError('User not found', 404);
  //       }

  //       const updatedUser = this.rolesRepository.merge(user!, updateDto);
  //       const result = await this.rolesRepository.save(updatedUser);
  //       const response: any = {
  //         id: result.id,
  //         username: result.username,
  //         name: result.name,
  //         email: result.email,
  //         roleId: result.roleId,
  //       };
  //       return successResponse(response, 'User updated successfully');
  //     } catch (error) {
  //       if (error instanceof HttpException) {
  //         throw error;
  //       }
  //       throw new InternalServerErrorException('Failed to update user');
  //     }
  //   }

  //   async remove(id: number): Promise<ApiResponse<null>> {
  //     try {
  //       const user = await this.rolesRepository.findOne({ where: { id } });

  //       if (!user) {
  //         throwError('User not found', 404);
  //       }
  //       await this.rolesRepository.softRemove(user!);

  //       return successResponse(null, 'User deleted successfully');
  //     } catch (error) {
  //       if (error instanceof HttpException) {
  //         throw error;
  //       }
  //       throw new InternalServerErrorException('Failed to delete user');
  //     }
  //   }
}
