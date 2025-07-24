import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { ItemsSpnumLog } from './entities/items_spnum_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, ItemsSpnumLog])],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
