import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Items_master } from './entities/master.entity';
import { Categories } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Items_master, Categories])],
  providers: [MasterService],
  controllers: [MasterController],
  exports: [MasterService],
})
export class MasterModule {}
