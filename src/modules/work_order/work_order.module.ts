import { Module } from '@nestjs/common';
import { WorkOrderService } from './work_order.service';
import { WorkOrderController } from './work_order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderForm } from './entities/order_form.entity';
import { BatchOutbound } from './entities/batch_outbound.entity';
import { RelocOutbound } from './entities/reloc_outbound.entity';
import { BatchInbound } from '../batch_in/entities/batchin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderForm, BatchOutbound, RelocOutbound, BatchInbound]),
  ],
  providers: [WorkOrderService],
  controllers: [WorkOrderController],
  exports: [WorkOrderService],
})
export class WorkOrderModule {}
