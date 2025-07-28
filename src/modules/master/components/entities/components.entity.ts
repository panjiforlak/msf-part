import { ApiProperty } from '@nestjs/swagger';
import { Inventory } from '../../../inventory/entities/inventory.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

export enum inv_type {
  OTHERS = 'others',
  SPAREPART = 'sparepart',
  NONSPAREPART = 'non-sparepart',
}

@Entity('components')
export class Components {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'uuid', default: () => 'gen_random_uuid()', unique: true })
  uuid: string;

  @Column({
    type: 'enum',
    enum: inv_type,
    default: inv_type.OTHERS,
  })
  inventory_type: inv_type;

  @Column({ type: 'varchar', length: 30, nullable: true, default: null })
  component_name: string;

  @Column({ type: 'int', default: 0 })
  createdBy: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  updatedBy: number;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date;

  @Column({ type: 'int', default: 0 })
  deletedBy: number;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
