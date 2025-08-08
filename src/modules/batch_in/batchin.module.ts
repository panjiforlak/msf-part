import { Module } from '@nestjs/common';
import { BatchInboundService } from './batchin.service';
import { BatchInboundController } from './batchin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchInbound } from './entities/batchin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BatchInbound])],
  providers: [BatchInboundService],
  controllers: [BatchInboundController],
  exports: [BatchInboundService],
})
export class BatchInboundModule {}
