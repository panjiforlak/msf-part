import { Module } from '@nestjs/common';
import { InOutAreaService } from './inout.service';
import { InOutAreaController } from './inout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboundOutboundArea } from './entities/inout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InboundOutboundArea])],
  providers: [InOutAreaService],
  controllers: [InOutAreaController],
  exports: [InOutAreaService],
})
export class InOutAreaModule {}
