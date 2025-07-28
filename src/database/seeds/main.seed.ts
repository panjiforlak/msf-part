import { AppDataSource } from '../data-source'; // ganti sesuai lokasi file config data source kamu
import { VehiclesSeeder } from './vehicles.seed';
import { UserSeeder } from './users.seed';

async function runSeeders() {
  const dataSource = await AppDataSource.initialize();

  await new UserSeeder().run(dataSource);
  await new VehiclesSeeder().run(dataSource);

  await dataSource.destroy();
  console.log('🌱 All seeders executed successfully');
}

runSeeders().catch((err) => {
  console.error('❌ Failed to run seeders:', err);
  process.exit(1);
});
