import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum wa_type {
  IN_AREA = 'inbound area',
  BOX = 'box',
  RACK = 'rack',
  OUT_AREA = 'outbound area',
  OTHERS = 'others',
}
export enum wa_status {
  SLOW_MOVE = 'slow moving',
  FAST_MOVE = 'fast moving',
  OTHERS = 'others',
}

@Entity()
export class Workingarea {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Expose()
  @Column({ type: 'uuid', default: () => 'gen_random_uuid()' })
  uuid: string;

  @Expose()
  @Column()
  working_area_code?: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: wa_type,
    default: wa_type.OTHERS,
  })
  working_area_type: wa_type;

  @Expose()
  @Column()
  working_area_availability?: boolean;

  @Expose()
  @Column({
    type: 'enum',
    enum: wa_status,
    default: wa_status.OTHERS,
  })
  working_area_status: wa_status;

  @Expose()
  @Column()
  barcode?: number;

  @Expose()
  @Column()
  remarks?: string;

  @Exclude()
  @Column()
  createdBy?: number;

  @Exclude()
  @CreateDateColumn()
  createdAt?: Date;

  @Exclude()
  @Column()
  updatedBy?: number;

  @Exclude()
  @UpdateDateColumn()
  updatedAt?: Date | null;

  @Exclude()
  @Column({ type: 'int', nullable: true })
  deletedBy?: number | null;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date | null;
}
