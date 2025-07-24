import { Module } from '@nestjs/common';
import { WorkingareaService } from './workingarea.service';
import { WorkingareaController } from './workingarea.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workingarea } from './entities/workingarea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workingarea])],
  providers: [WorkingareaService],
  controllers: [WorkingareaController],
  exports: [WorkingareaService],
})
export class WorkingareaModule {}
