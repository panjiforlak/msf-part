import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SppbController } from './sppb.controller';
import { SppbService } from './sppb.service';
import { Sppb } from './entities/sppb.entity';
import { OrderForm } from '../work_order/entities/order_form.entity';
import { Users } from '../users/entities/users.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { BatchOutbound } from '../work_order/entities/batch_outbound.entity';
import { Storagearea } from '../master/storage/entities/storagearea.entity';
import { S3Module } from '../../integrations/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sppb,
      OrderForm,
      Users,
      Inventory,
      BatchOutbound,
      Storagearea,
    ]),
    S3Module,
  ],
  controllers: [SppbController],
  providers: [SppbService],
  exports: [SppbService],
})
export class SppbModule {}
