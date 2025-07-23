import { DataSource } from 'typeorm';
import { Users } from '../../modules/users/entities/users.entity';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(Users);
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users: Partial<Users>[] = [];

    for (let i = 1; i <= 10; i++) {
      users.push({
        email: `user${i}@example.com`,
        username: `user${i}`,
        password: hashedPassword,
        roleId: 2,
      });
    }

    const createdUsers = userRepository.create(users); // Konversi ke entity
    await userRepository.save(createdUsers);

    console.log('✅ 10 dummy users seeded');
  }
}
