import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { ItemsSpnumLog } from './entities/items_spnum_log.entity';
import { S3Service } from '../../integrations/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, ItemsSpnumLog])],
  providers: [InventoryService, S3Service],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
