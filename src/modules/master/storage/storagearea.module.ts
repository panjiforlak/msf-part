import { Module } from '@nestjs/common';
import { StorageareaService } from './storagearea.service';
import { StorageareaController } from './storagearea.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storagearea } from './entities/storagearea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Storagearea])],
  providers: [StorageareaService],
  controllers: [StorageareaController],
  exports: [StorageareaService],
})
export class StorageareaModule {}
