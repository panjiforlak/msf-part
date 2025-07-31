import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdaOutboundController } from './pda_outbound.controller';
import { PdaOutboundService } from './pda_outbound.service';
import { OrderForm } from '../work_order/entities/order_form.entity';
import { BatchOutbound } from '../work_order/entities/batch_outbound.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderForm, BatchOutbound])],
  controllers: [PdaOutboundController],
  providers: [PdaOutboundService],
  exports: [PdaOutboundService],
})
export class PdaOutboundModule {} 