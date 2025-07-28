import { DataSource } from 'typeorm';
import { Vehicles } from '../../modules/master/vehicles/entities/vehicle.entity';
import { faker } from '@faker-js/faker';

export class VehiclesSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const vehicleRepository = dataSource.getRepository(Vehicles);

    const typeOptions = ['Dump Truck', 'Support Vehicle', 'Heavy Equipment'];

    const vehicles: Partial<Vehicles>[] = [];

    for (let i = 0; i < 50; i++) {
      vehicles.push({
        vin_number: faker.vehicle.vin(),
        vehicle_number: `B ${faker.number.int({ min: 1000, max: 9999 })} ${faker.string.alpha({ length: 2, casing: 'upper' })}`,
        brand: faker.vehicle.manufacturer(),
        type: faker.helpers.arrayElement(typeOptions),
        capacity_ton: faker.helpers.arrayElement(['1', '2', '5', '10']),
        status: faker.helpers.arrayElement(['active', 'inactive']),
        createdBy: 1,
        updatedBy: 1,
      });
    }

    const created = vehicleRepository.create(vehicles);
    await vehicleRepository.save(created);

    console.log('✅ 50 Vehicles seeded');
  }
}
