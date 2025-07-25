import { Module } from '@nestjs/common';
import { DocShippingService } from './doc_shipping.service';
import { DocShippingController } from './doc_shipping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocShipping } from './entities/doc_shipping.entity';
import { S3Module } from '../../integrations/s3/s3.module';
import { S3Service } from '../../integrations/s3/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocShipping, S3Module])],
  providers: [DocShippingService, S3Service],
  controllers: [DocShippingController],
  exports: [DocShippingService],
})
export class DocShippingModule {}
