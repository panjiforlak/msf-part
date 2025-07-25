import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsController } from './components.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Components } from './entities/components.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Components])],
  providers: [ComponentsService],
  controllers: [ComponentsController],
  exports: [ComponentsService],
})
export class ComponentsModule {}
