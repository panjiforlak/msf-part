import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdaOutboundController } from './pda_outbound.controller';
import { PdaOutboundService } from './pda_outbound.service';
import { OrderForm } from '../work_order/entities/order_form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderForm])],
  controllers: [PdaOutboundController],
  providers: [PdaOutboundService],
  exports: [PdaOutboundService],
})
export class PdaOutboundModule {} 