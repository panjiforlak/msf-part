import { Module } from '@nestjs/common';
import { WorkOrderService } from './work_order.service';
import { WorkOrderController } from './work_order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderForm } from './entities/order_form.entity';
import { BatchOutbound } from './entities/batch_outbound.entity';
import { RelocOutbound } from './entities/reloc_outbound.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderForm, BatchOutbound, RelocOutbound])],
  providers: [WorkOrderService],
  controllers: [WorkOrderController],
  exports: [WorkOrderService],
})
export class WorkOrderModule {} 