import { Inventory } from '../../inventory/entities/inventory.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum batchin_type {
  INBOUND = 'inbound',
  STORAGE = 'storage',
  OTHERS = 'others',
}

@Entity('batch_inbound')
export class BatchInbound {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
    default: () => "encode(gen_random_bytes(6), 'hex')",
  })
  barcode: string;

  @Column({ type: 'int', default: 0 })
  inventory_id: number;

  @Column({ type: 'int', default: 0 })
  doc_ship_id: number;

  @Column({ type: 'int', default: 0 })
  supplier_id: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  picker_id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  arrival_date: Date;

  @Column({
    type: 'enum',
    enum: batchin_type,
    default: batchin_type.OTHERS,
  })
  status_reloc: batchin_type;

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

  @ManyToOne(() => Inventory, (inventory) => inventory.batch_inbounds)
  @JoinColumn({ name: 'inventory_id' })
  inventory?: Inventory;
}
