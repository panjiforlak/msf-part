import { Module } from '@nestjs/common';
import { VehicleService } from './employee.service';
import { VehicleController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicles } from './entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicles])],
  providers: [VehicleService],
  controllers: [VehicleController],
  exports: [VehicleService],
})
export class VehicleModule {}
