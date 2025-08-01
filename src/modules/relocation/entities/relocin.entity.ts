import { BatchInbound } from '../../batch_in/entities/batchin.entity';
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

@Entity('relocation')
export class RelocInbound {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
    default: () => "encode(gen_random_bytes(6), 'hex')",
  })
  uuid: string;

  @Column({ type: 'int', default: 0 })
  batch_in_id: number;

  @Column({ type: 'int', default: 0 })
  reloc_from: number;

  @Column({ type: 'int', default: 0 })
  reloc_to: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  quantity_temp_outbound: number;

  @Column({ type: 'int', nullable: true })
  picker_id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  reloc_date: Date;

  @Column()
  reloc_type: string;

  @Column({ default: false })
  reloc_status: boolean;

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

  @OneToMany(() => BatchInbound, (batch_inbound) => batch_inbound.inventory)
  batch_inbounds?: BatchInbound[];
  @ManyToOne(() => BatchInbound, (batch_in) => batch_in.batch_in)
  @JoinColumn({ name: 'batch_in_id' })
  batch_in?: BatchInbound;
}
