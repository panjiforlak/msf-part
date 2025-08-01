import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdaOutboundController } from './pda_outbound.controller';
import { PdaOutboundService } from './pda_outbound.service';
import { OrderForm } from '../work_order/entities/order_form.entity';
import { BatchOutbound } from '../work_order/entities/batch_outbound.entity';
import { BatchInbound } from '../batch_in/entities/batchin.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { RelocInbound } from '../relocation/entities/relocin.entity';
import { Vehicles } from '../master/vehicles/entities/vehicle.entity';
import { Users } from '../users/entities/users.entity';
import { Sppb } from './entities/sppb.entity';
import { InboundOutboundArea } from '../master/inoutarea/entities/inout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderForm, BatchOutbound, BatchInbound, Inventory, RelocInbound, Vehicles, Users, Sppb, InboundOutboundArea])],
  controllers: [PdaOutboundController],
  providers: [PdaOutboundService],
  exports: [PdaOutboundService],
})
export class PdaOutboundModule {} 