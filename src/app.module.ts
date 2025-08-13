import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { MasterModule } from './modules/master/master.module';
import { SettingsModule } from './modules/settings/settings.module';
import { VehicleModule } from './modules/master/vehicles/vehicle.module';
import { EmployeeModule } from './modules/master/employee/employee.module';
import { SuppliersModule } from './modules/master/suppliers/suppliers.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { WorkingareaModule } from './modules/master/workingarea/workingarea.module';
import { StorageareaModule } from './modules/master/storage/storagearea.module';
import { InOutAreaModule } from './modules/master/inoutarea/inout.module';
import { DocShippingModule } from './modules/doc_shipping/doc_shipping.module';
import { BatchInboundModule } from './modules/batch_in/batchin.module';
import { RelocInboundModule } from './modules/relocation/relocin.module';
import { ComponentsModule } from './modules/master/components/components.module';
import { WorkOrderModule } from './modules/work_order/work_order.module';
import { PdaOutboundModule } from './modules/pda_outbound/pda_outbound.module';
import { SppbModule } from './modules/sppb/sppb.module';
import { ActivityModule } from './modules/master/activity/activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [__dirname + '/modules/**/entities/*.entity{.ts,.js}'],
        synchronize: false,
      }),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    MasterModule,
    SettingsModule,
    VehicleModule,
    EmployeeModule,
    SuppliersModule,
    InventoryModule,
    WorkingareaModule,
    StorageareaModule,
    InOutAreaModule,
    DocShippingModule,
    BatchInboundModule,
    RelocInboundModule,
    ComponentsModule,
    WorkOrderModule,
    PdaOutboundModule,
    SppbModule,
    ActivityModule,
  ],
})
export class AppModule {}
