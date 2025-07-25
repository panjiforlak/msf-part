import { Module } from '@nestjs/common';
import { RelocInboundService } from './relocin.service';
import { RelocInboundController } from './relocin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelocInbound } from './entities/relocin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RelocInbound])],
  providers: [RelocInboundService],
  controllers: [RelocInboundController],
  exports: [RelocInboundService],
})
export class RelocInboundModule {}
