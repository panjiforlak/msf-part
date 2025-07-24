import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum StorageType {
  OTHERS = 'others',
  BOX = 'box',
  RACK = 'rack',
}

export enum StorageStatus {
  SLOW_MOVING = 'slow moving',
  FAST_MOVING = 'fast moving',
  TEMP = 'temp',
}

@Entity('storage_area')
export class Storagearea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
    default: () => "encode(gen_random_bytes(6), 'hex')",
  })
  barcode: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  remarks: string;

  @Column({
    type: 'enum',
    enum: StorageType,
    default: StorageType.OTHERS,
  })
  storage_type: StorageType;

  @Column({ type: 'boolean', default: true })
  storage_availability: boolean;

  @Column({
    type: 'enum',
    enum: StorageStatus,
    default: StorageStatus.TEMP,
  })
  status: StorageStatus;

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
