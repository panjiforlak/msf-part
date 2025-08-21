import { RelocInbound } from '../../relocation/entities/relocin.entity';
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
  OneToMany,
} from 'typeorm';

@Entity('temp_inbound_queue')
export class QueueInbound {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  batch_in_id: number;

  @Column()
  batch: string;

  @Column({ type: 'int', default: 0 })
  inventory_id: number;

  @Column()
  part_name: string;

  @Column()
  part_number: string;

  @Column()
  part_number_internal: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column()
  rack_destination: string;

  @Column()
  barcode: string;

  @Column()
  storage_source: string;

  @Column({ type: 'int', default: 0 })
  storage_source_id: number;

  @Column({ type: 'int', default: 0 })
  picker_id: number;

  @Column({ type: 'int', default: 0 })
  createdBy: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
