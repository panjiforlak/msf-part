import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SppbController } from './sppb.controller';
import { SppbService } from './sppb.service';
import { Sppb } from './entities/sppb.entity';
import { OrderForm } from '../work_order/entities/order_form.entity';
import { Users } from '../users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sppb, OrderForm, Users])],
  controllers: [SppbController],
  providers: [SppbService],
  exports: [SppbService],
})
export class SppbModule {} 