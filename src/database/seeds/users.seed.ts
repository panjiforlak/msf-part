import { AppDataSource } from '../data-source';
import { Users } from '../../modules/users/entities/users.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(Users);

  const exist = await userRepository.findOne({ where: { username: 'admin' } });

  if (exist) {
    console.log('👤 Admin user already exists. Skipping...');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = userRepository.create({
    name: 'Administrator',
    username: 'admin',
    password: hashedPassword,
    roleId: 1,
    email: 'admin@msf.com',
  });

  await userRepository.save(adminUser);

  console.log('✅ Admin user seeded successfully');
  process.exit();
}

seed().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
