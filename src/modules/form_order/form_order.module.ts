import { Module } from '@nestjs/common';
import { FormOrderService } from './form_order.service';
import { FormOrderController } from './form_order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormOrder } from './entities/formOrder.entity';
import { F } from '@faker-js/faker/dist/airline-CLphikKp';
import { FormOrderDetail } from './entities/formOrderDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormOrder, FormOrderDetail])],
  providers: [FormOrderService],
  controllers: [FormOrderController],
  exports: [FormOrderService],
})
export class FormOrderModule {}
