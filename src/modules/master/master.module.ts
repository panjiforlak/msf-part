import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { MasterDataController } from './masterdata.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Items } from './entities/master.entity';
import { Categories } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Items, Categories])],
  providers: [MasterService],
  controllers: [MasterController, MasterDataController],
  exports: [MasterService],
})
export class MasterModule {}
