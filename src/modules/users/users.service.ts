import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RabbitmqService } from '../../integrations/rabbitmq/rabbitmq.service';
import { throwError } from '../../common/helpers/response.helper';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    const result: any = await this.userRepository.findOne({ where: { id } });
    if (!result) {
      throwError('User not found', 404);
    }
    const response: any = {
      id: result.id,
      username: result.username,
      first_name: result.first_name,
      last_name: result.last_name,
    };
    return response;
  }

  async create(data: Partial<User>): Promise<User> {
    console.log(data);
    const user = this.userRepository.create(data);
    const savedUser = await this.userRepository.save(user);

    await this.rabbitmqService.emit('user.created', { id: savedUser.id });
    return savedUser;
  }

  async delete(id: number) {
    return this.userRepository.delete(id);
  }
}
