import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { RabbitmqService } from '../../integrations/rabbitmq/rabbitmq.service';
import { CreateUserDto, GetUsersQueryDto, UpdateUserDto } from './dto/user.dto';

const mockUser: Users = {
  id: 1,
  username: 'newuser',
  password: 'hashed',
  name: 'User',
  roleId: 1,
  email: 'user@example.com',
  isActive: true,
  createdAt: new Date(),
  deletedAt: null,
};
describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<Users>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            softRemove: jest.fn(),
          },
        },
        {
          provide: RabbitmqService,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(Users));
  });

  describe('findByUsername', () => {
    it('should return a user if found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as any);
      const result = await service.findByUsername('testuser');
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser', isActive: true },
        withDeleted: false,
      });
    });

    it('should return null if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await service.findByUsername('notfound');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return new user', async () => {
      const dto: CreateUserDto = {
        username: 'newuser',
        password: 'password123',
        name: 'New User',
        roleId: 2,
        email: 'new@example.com',
      };

      userRepository.findOne.mockResolvedValue(null); // No existing user
      userRepository.create.mockReturnValue({
        ...dto,
        password: 'hashedPassword',
      } as any);
      userRepository.save.mockResolvedValue({
        id: 2,
        ...dto,
        password: 'hashedPassword',
      } as any);

      const result = await service.create(dto);
      expect(result.data!.username).toBe('newuser');
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });
    it('should create and return already register', async () => {
      const dto: CreateUserDto = {
        username: 'newuser',
        password: 'password123',
        name: 'New User',
        roleId: 2,
        email: 'new@example.com',
      };

      userRepository.findOne.mockResolvedValue(mockUser); //  existing user
      await expect(service.create(dto)).rejects.toThrow(
        'Username already registered',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const query: GetUsersQueryDto = {
        page: '1',
        limit: '10',
        search: '',
      };

      const usersArray = [mockUser];
      userRepository.findAndCount.mockResolvedValue([usersArray, 1]);

      const result = await service.findAll(query);
      expect(result.data).toEqual(usersArray);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as any);
      const result = await service.findById(1);
      expect(result.data).toMatchObject({
        id: 1,
        username: 'newuser',
        name: 'User',
        roleId: 1,
      });
    });

    it('should throw error if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const dto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        roleId: 2,
      };

      userRepository.findOne.mockResolvedValue(mockUser as any);
      userRepository.merge.mockReturnValue({ ...mockUser, ...dto });
      userRepository.save.mockResolvedValue({ ...mockUser, ...dto });

      const result = await service.update(1, dto);
      expect(result.data?.name).toBe('Updated Name');
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(
        service.update(99, { name: 'x', email: 'x@example.com', roleId: 1 }),
      ).rejects.toThrow('User not found');
    });
  });

  describe('remove', () => {
    it('should soft delete user if found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as any);
      userRepository.softRemove.mockResolvedValue(mockUser as any);

      const result = await service.remove(1);
      expect(result.message).toBe('User deleted successfully');
      expect(userRepository.softRemove).toHaveBeenCalled();
    });

    it('should throw if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(123)).rejects.toThrow('User not found');
    });
  });
});
