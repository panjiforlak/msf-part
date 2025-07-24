import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum inout_type {
  OTHERS = 'others',
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

@Entity('inbound_outbound_area')
export class InboundOutboundArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
    default: () => "encode(gen_random_bytes(6), 'hex')",
  })
  barcode: string;

  @Column({ type: 'varchar', length: 15, nullable: true, default: null })
  inout_area_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  remarks: string;

  @Column({
    type: 'enum',
    enum: inout_type,
    default: inout_type.OTHERS,
  })
  type: inout_type;

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
